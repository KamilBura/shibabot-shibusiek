// src/functions/stalkingManager.js

const { Client, Collection, EmbedBuilder } = require('discord.js');

// Create a Collection to store stalking information
const stalkingData = new Collection();

const stalkingManager = (client, userId, channelId, duration) => {
    const interval = 60000; // Check every minute
    let remainingDuration = duration * 60; // Convert hours to minutes

    const checkStatus = async () => {
        const user = await client.users.fetch(userId);
        const member = await client.guilds.cache.get(client.guildId).members.fetch(user.id);

        if (member.presence.status !== 'offline') {
            // User is online, send notification
            const channel = await client.channels.fetch(channelId);
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${user.tag} is now ${member.presence.status}`)
                .setDescription(`Remaining duration: ${Math.ceil(remainingDuration / 60)} hours`);

            channel.send({ embeds: [embed] });
        }

        remainingDuration--;

        if (remainingDuration <= 0) {
            // Stop stalking after the specified duration
            clearInterval(stalkingInterval);

            // Remove the user from the Collection when stalking stops
            stalkingData.delete(userId);
        }
    };

    // Store stalking information in the Collection
    stalkingData.set(userId, { channelId, duration });

    // Check the user's status immediately after starting
    checkStatus();

    const stalkingInterval = setInterval(checkStatus, interval);
};

module.exports = {
    stalkingManager,
    stalkingData, // Export the Collection for other parts of your code to access if needed
};
