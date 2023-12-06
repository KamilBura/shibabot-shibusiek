const { Client, Collection, EmbedBuilder } = require('discord.js');
const { log } = require('./consoleLog');

// Create a Collection to store stalking information
const stalkingData = new Collection();
const stalkingCount = new Collection();

stalkingCount.clear();

const incrementStalkCount = (userId) => {
    stalkingCount.set(userId, (stalkingCount.get(userId) || 0) + 1);
};

const decrementStalkCount = (userId) => {
    stalkingCount.set(userId, Math.max(0, (stalkingCount.get(userId) || 0) - 1));
};

// Add a check for maximum total stalk count
const isMaxTotalStalkCountReached = (userId, isDM) => {
    const userStalkCount = stalkingCount.get(userId) || 0;
    return userStalkCount + (isDM ? 0 : 0) >= 2;
};

const parseDuration = (duration) => {
    const regex = /(\d+)([hms])/g;
    let match;
    let seconds = 0;

    while ((match = regex.exec(duration)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        if (unit === 'h') {
            seconds += value * 3600;
        } else if (unit === 'm') {
            seconds += value * 60;
        } else if (unit === 's') {
            seconds += value;
        }
    }

    return seconds;
};

const stalkingManager = (client, userId, channelId, interactionId, duration, intervalInSeconds, startedBy, isDM) => {
    log(`Stalking manager started for user ${userId}`, 'command');
    const interval = Math.max(2000, Math.min(intervalInSeconds * 1000, 300000));
    let remainingDuration = parseDuration(duration); // Convert duration to seconds

    const StartedBy = interactionId;
    const startedAt = new Date();
    const formattedStartedAt = startedAt.toLocaleString('en-US');

    // Check if the person has reached the maximum allowed stalk count
    if (isMaxTotalStalkCountReached(startedBy, isDM)) {
        // Send an embed to the channel indicating the maximum stalk count
        const embed = new EmbedBuilder()
            .setColor('#ff0000') // Red color
            .setTitle('Maximum Stalk Count Reached')
            .setDescription(`You have reached the maximum allowed stalk count (2 users).`)
            .setFooter({ text: 'ShibaBot Stalker' });

        const channel = isDM ? client.channels.cache.get(channelId) : client.channels.cache.get(client.guildId);
        channel.send({ embeds: [embed] });

        // Log the information
        log(`User ${startedBy} has reached the maximum allowed stalk count.`);

        return;
    }


    incrementStalkCount(startedBy);

    let continueStalking = true;

    const checkStatus = async () => {
        if (!continueStalking) {
            return;
        }

        log(`Checking status for user ${userId}`, 'check');

        const user = await client.users.fetch(userId).catch(() => null);
        const guild = client.guilds.cache.get(client.guildId);
        const member = guild.members.cache.get(user.id);
        const stalkingInfo = stalkingData.get(userId);

        if (!stalkingInfo) {
            // Initialize stalking information
            const channel = await client.channels.fetch(channelId);
            const embed = new EmbedBuilder()
                .setColor('#ffcc00') // Shiba yellow color
                .setTitle(`${user.tag} is now ${getStatusText(member?.presence?.status)}`)
                .setDescription(`Remaining duration: ${formatDuration(remainingDuration)}`)
                .setThumbnail(user.displayAvatarURL()) // Add user's avatar to the right side
                .setFooter({ text: `ShibaBot Stalker | Last checked: ${new Date().toLocaleString()}` });

            const sentMessage = await channel.send({ embeds: [embed] });

            stalkingData.set(userId, {
                channelId,
                duration,
                messageId: sentMessage.id,
                lastStatus: member?.presence?.status || 'offline',
                presenceChanges: [],
                stalkingInterval: stalkingInterval,
                interval: intervalInSeconds,
                StartedBy,
                remainingDuration: parseDuration(duration),
                formattedStartedAt,
            });
        } else {
            // User is online, send notification
            const channel = await client.channels.fetch(channelId);

            const embed = new EmbedBuilder()
                .setColor('#ffcc00') // Shiba yellow color
                .setTitle(`${user.tag} is now ${getStatusText(member?.presence?.status || 'offline')}`)
                .setDescription(`Remaining duration: ${formatDuration(remainingDuration)}`)
                .setThumbnail(user.displayAvatarURL()) // Add user's avatar to the right side
                .setFooter({ text: `ShibaBot Stalker | Last checked: ${new Date().toLocaleString()}` });

            // Check if Presence Change field has been added before and if presence has changed since the last field
            const newStatus = member?.presence?.status || 'offline';
            if (newStatus !== stalkingInfo.lastStatus) {
                embed.addFields({
                    name: 'Presence Change',
                    value: `Changed at: ${new Date().toLocaleString()}\nNew Status: ${getStatusText(newStatus)} {${getStatusEmoji(newStatus)}}`
                });

                stalkingData.set(userId, {
                    ...stalkingInfo,
                    lastStatus: newStatus,
                    presenceChanges: [...stalkingInfo.presenceChanges, {
                    timestamp: new Date().toLocaleString(),
                    status: newStatus,
                    }],
                    stalkingInterval: stalkingInterval,
                });
            }

            stalkingInfo.presenceChanges.forEach(change => {
                embed.addFields({
                    name: `Presence Change (${change.timestamp})`,
                    value: `New Status: ${getStatusText(change.status)} {${getStatusEmoji(change.status)}}`
                });
            });

            const existingMessage = stalkingInfo.messageId ? await channel.messages.fetch(stalkingInfo.messageId).catch(() => null) : null;

            if (existingMessage) {
                existingMessage.edit({ embeds: [embed] });
            } else {
                const sentMessage = await channel.send({ embeds: [embed] });

                stalkingData.set(userId, {
                    ...stalkingInfo,
                    messageId: sentMessage.id,
                });
            }
        }

        remainingDuration -= interval / 1000;

        if (remainingDuration <= 0) {
            log(`Stopping stalking for user ${userId}`, 'command');

            const stalkingInfo = stalkingData.get(userId);

            const finalEmbed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setTitle(`${user.tag}'s Stalking Summary`)
                .setDescription('Stalking duration has ended.')
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: `ShibaBot Stalker | Last checked: ${new Date().toLocaleString()}` });

            stalkingInfo.presenceChanges.forEach(change => {
                finalEmbed.addFields({
                    name: `Presence Change (${change.timestamp})`,
                    value: `Status: ${getStatusText(change.status)} {${getStatusEmoji(change.status)}}`
                });
            });

            const channel = await client.channels.fetch(channelId);
            const existingMessage = stalkingInfo.messageId ? await channel.messages.fetch(stalkingInfo.messageId).catch(() => null) : null;
            existingMessage.delete();
            channel.send({ embeds: [finalEmbed] });
            
            // Clear the interval and remove user from the collection
            clearInterval(stalkingInterval);
            stalkingData.delete(userId);

            decrementStalkCount(startedBy);
            
            continueStalking = false;
            return; // Exit the function if duration is not positive
        }
    };
    
    const stalkingInterval = setInterval(checkStatus, interval);
    // Check the user's status immediately after starting
    checkStatus();
};


const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getStatusText = (status) => {
    switch (status) {
        case 'online':
            return 'Online';
        case 'idle':
            return 'Idle';
        case 'dnd':
            return 'Do Not Disturb';
        case 'offline':
            return 'Offline';
        default:
            return 'Unknown Status';
    }
};

const getStatusEmoji = (status) => {
    switch (status) {
        case 'online':
            return '🟢';
        case 'idle':
            return '🟡';
        case 'dnd':
            return '🔴';
        case 'offline':
            return '⚫';
        default:
            return '❓';
    }
};

module.exports = {
    formatDuration,
    getStatusEmoji,
    getStatusText,
    stalkingManager,
    stalkingData, // Export the Collection for other parts of your code to access if needed
    stalkingCount,
    decrementStalkCount,
    incrementStalkCount,
    isMaxTotalStalkCountReached,
};
