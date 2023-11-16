const { EmbedBuilder } = require('discord.js');

module.exports = {
    fetchingPing: () => new EmbedBuilder()
        .setDescription('🐕 | Fetching ping...')
        .setColor('#6F8FAF'),

    pong: (_apiState, _apiPing, _botState, _botPing, interaction) => new EmbedBuilder()
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
        }),

    error: (errorMessage) => new EmbedBuilder()
        .setTitle('Error')
        .setDescription(errorMessage)
        .setColor('#FF0000'), // Red color
};