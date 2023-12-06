const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Ping the bot',
        commandsCategory: 'ADMIN',
    },
    execute: async (interaction, client, args) => {
        try {
            await interaction.deferReply(); 

            const embed = new EmbedBuilder()
                .setDescription('🐕 | Fetching ping...')
                .setColor('#6F8FAF');

            let message = await interaction.editReply({ embeds: [embed] });

            let zap = "⚡";
            let green = "🟩";
            let yellow = "🟨";
            let red = "🟥";

            var _botState = zap;
            var _apiState = zap;

            let _apiPing = interaction.client.ws.ping;
            let _botPing = Math.floor(message.createdTimestamp - interaction.createdTimestamp);

            if (_apiPing >= 40 && _apiPing < 200) {
                _apiState = green;
            } else if (_apiPing >= 200 && _apiPing < 400) {
                _apiState = yellow;
            } else if (_apiPing >= 400) {
                _apiState = red;
            }

            if (_botPing >= 40 && _botPing < 200) {
                _botState = green;
            } else if (_botPing >= 200 && _botPing < 400) {
                _botState = yellow;
            } else if (_botPing >= 400) {
                _botState = red;
            }

            const embedfinish = new EmbedBuilder()
            .setTitle("🐕 | Pong!")
            .addFields(
                {
                    name: "API Latency",
                    value: `\`\`\`yml\n${_apiState} | ${_apiPing}ms\`\`\``,
                    inline: true,
                },
                {
                    name: "Bot Latency",
                    value: `\`\`\`yml\n${_botState} | ${_botPing}ms\`\`\``,
                    inline: true,
                }
            )
            .setColor('#FFFF00') // Yellow color
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL(),
            });

            message.delete();
            await interaction.followUp({embeds: [embedfinish] });
        } catch (error) {
            console.error(error);
            interaction.reply({ embeds: [embeds.error], ephemeral: true});
        }
    },
};