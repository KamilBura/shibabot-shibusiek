const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(message, client) {
        // Respond with an embed when the bot is mentioned
        if (message.mentions.has(client.user) && !message.author.bot) {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle('Hello! 👋')
                .setDescription(`Use \`/help\` to see all the commands that I have.`);
            message.reply({ embeds: [embed] });
        }
    },
};
