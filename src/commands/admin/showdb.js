const { EmbedBuilder } = require('discord.js');
const { getServerInfo } = require('../../database/dbManager');

module.exports = {
    data: {
        name: 'showdb',
        description: 'Show the contents of the database',
        commandCategory: 'ADMIN',
    },
    async execute(message) {
        try {
            // Retrieve data from the database
            const serverInfo = getServerInfo(message.guild.id);

            // Create an array of fields
            const fields = [
                {
                    name: 'Server Information',
                    value: '```json\n' + JSON.stringify(serverInfo, null, 2) + '\n```',
                },
            ];

            // Create an embed to display the database contents
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Database Contents')
                .addFields(fields)
                .setTimestamp();

            // Send the embed to the channel
            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.log(error);
        }
    },
};