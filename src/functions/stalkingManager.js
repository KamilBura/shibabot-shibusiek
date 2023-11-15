const { Client, Collection, EmbedBuilder } = require('discord.js');

// Create a Collection to store stalking information
const stalkingData = new Collection();

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

const stalkingManager = (client, userId, channelId, interactionId, duration, intervalInSeconds) => {
    console.log(`Stalking manager started for user ${userId}`);
    const interval = Math.max(2000, Math.min(intervalInSeconds * 1000, 300000));
    let remainingDuration = parseDuration(duration); // Convert duration to seconds

    const checkStatus = async () => {
        console.log(`Checking status for user ${userId}`);

        const user = await client.users.fetch(userId);
        const member = await client.guilds.cache.get(client.guildId).members.fetch(user.id);
        const stalkingInfo = stalkingData.get(userId);

        if (!stalkingInfo) {
            // Initialize stalking information
            const channel = await client.channels.fetch(channelId);
            const embed = new EmbedBuilder()
                .setColor('#ffcc00') // Shiba yellow color
                .setTitle(`${user.tag} is now ${getStatusText(member.presence.status)}`)
                .setDescription(`Remaining duration: ${formatDuration(remainingDuration)}`)
                .setThumbnail(user.displayAvatarURL()) // Add user's avatar to the right side
                .setFooter({ text: `ShibaBot Stalker | Last checked: ${new Date().toLocaleString()}` });

            const sentMessage = await channel.send({ embeds: [embed] });

            stalkingData.set(userId, {
                channelId,
                duration,
                messageId: sentMessage.id,
                lastStatus: member.presence.status,
                presenceChanges: [],
                stalkingInterval: stalkingInterval,
            });
        } else {
            // User is online, send notification
            const channel = await client.channels.fetch(channelId);

            const embed = new EmbedBuilder()
                .setColor('#ffcc00') // Shiba yellow color
                .setTitle(`${user.tag} is now ${getStatusText(member.presence.status)}`)
                .setDescription(`Remaining duration: ${formatDuration(remainingDuration)}`)
                .setThumbnail(user.displayAvatarURL()) // Add user's avatar to the right side
                .setFooter({ text: `ShibaBot Stalker | Last checked: ${new Date().toLocaleString()}` });

            // Check if Presence Change field has been added before and if presence has changed since the last field
            if (member.presence.status !== stalkingInfo.lastStatus) {
                embed.addFields({
                    name: 'Presence Change',
                    value: `Changed at: ${new Date().toLocaleString()}\nNew Status: ${getStatusText(member.presence.status)} {${getStatusEmoji(member.presence.status)}}`
                });

                stalkingData.set(userId, {
                    ...stalkingInfo,
                    lastStatus: member.presence.status,
                    presenceChanges: [...stalkingInfo.presenceChanges, {
                    timestamp: new Date().toLocaleString(),
                    status: member.presence.status,
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
                existingMessage.delete().catch(error => console.error('Error deleting message:', error));
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
            console.log(`Stopping stalking for user ${userId}`);

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
            channel.send({ embeds: [finalEmbed] });
            
            // Clear the interval and remove user from the collection
            clearInterval(stalkingInterval);
            stalkingData.delete(userId);
        
            return; // Exit the function if duration is not positive
        }
    };

    // Check the user's status immediately after starting
    checkStatus();

    const stalkingInterval = setInterval(checkStatus, interval);
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
    getStatusEmoji,
    getStatusText,
    stalkingManager,
    stalkingData, // Export the Collection for other parts of your code to access if needed
};
