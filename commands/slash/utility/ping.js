const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config/config')
const ShibaBot = require('../../../class/ShibaBot');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('View the bot\'s latency'),
    /**
     * @param {ShibaBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {
        let message = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("🏓 | Fetching ping...")
                    .setColor("#6F8FAF"),
            ],
        });

        let zap = "⚡";
        let green = "💚";
        let red = "❤️";
        let yellow = "💛";

        var botState = zap;
        var apiState = zap;

        let apiPing = client.ws.ping;
        let botPing = Math.floor(message.createdTimestamp - interaction.createdTimestamp);

        if (apiPing >= 40 && apiPing < 200) {
            apiState = green;
        } else if (apiPing >= 200 && apiPing < 400) {
            apiState = yellow;
        } else if (apiPing >= 400) {
            apiState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            botState = green;
        } else if (botPing >= 200 && botPing < 400) {
            botState = yellow;
        } else if (botPing >= 400) {
            botState = red;
        }

        message.delete();
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🏓 | Pong!")
                    .addFields(
                        {
                            name: "API Latency",
                            value: `\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\``,
                            inline: true,
                        },
                        {
                            name: "Bot Latency",
                            value: `\`\`\`yml\n${botState} | ${botPing}ms\`\`\``,
                            inline: true,
                        }
                    )
                    .setColor(config.embedColor)
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.avatarURL(),
                    }),
            ],
        });
    },
};
