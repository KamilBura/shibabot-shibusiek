const { EmbedBuilder } = require('discord.js');
const config = require('@config/config');
const embeds = require('@helpers/embeds');

module.exports = {
    data: {
        name: 'ping',
        description: 'Ping the bot',
    },
    execute: async (client, interaction, args) => {
        try {
            await interaction.defer(); // Explicitly defer the reply

            let message = await interaction.editReply({
                embeds: [ 
                    embeds.fetchingPing(),
                ],
            });

            let zap = "⚡";
            let green = "🟩";
            let yellow = "🟨";
            let red = "🟥";

            var _botState = zap;
            var _apiState = zap;

            let _apiPing = client.ws.ping;
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

            message.delete();
            await interaction.followUp({
                embeds: [
                    embeds.pong(_apiState, _apiPing, _botState, _botPing, interaction),
                ],
            });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your command.');
        }
    },
};