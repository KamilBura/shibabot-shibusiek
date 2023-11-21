const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const os = require('os');
const config = require('@config/config');

module.exports = {
    data: {
        name: 'stats',
        description: 'Get information about the bot',
    },
    execute: async (interaction, client) => {
        try {
            if (!client) {
                throw new Error('Client object is undefined.');
            }

            const osversion = os.platform() + " " + os.release();
            const nodeVersion = process.version;

            const runtime = moment
                .duration(client.uptime)
                .format("d[ Days]-h[ Hrs]-m[ Mins]-s[ Secs]");

            var systemuptime = moment
                .duration(os.uptime() * 1000)
                .format("d[ Days]-h[ Hrs]-m[ Mins]-s[ Secs]");

            let gitHash = "unkown";
            try {
                gitHash = require("child_process")
                    .execSync("git rev-parse HEAD")
                    .toString()
                    .trim();
            } catch (error) {
                gitHash = "unkown";
            }

            const statsEmbed = new EmbedBuilder()
                .setTitle(`${client.user.username} Information`)
                .setColor("#f1c40f") // Shiba Color
                .setDescription(`\`\`\`yml\nName: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI: ${client.ws.ping}ms\nRuntime: ${runtime}\`\`\``,)
                .setFields([
                    {
                        name: `💚Lavalink stats`,
                        value: `\`\`\`yml\nUptime: SOON!\nRAM: SOON!\nMusicPlayers: SOON!\`\`\``,
                        inline: true,
                    },
                    {
                        name: "❤️Bot stats",
                        value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size} \nNodeJS: ${nodeVersion}\nShibaBot: v${require("../../../package.json").version} \`\`\``,
                        inline: true,
                    },
                    {
                        name: "💻System stats",
                        value: `\`\`\`yml\nOS: ${osversion}\nUptime: ${systemuptime}\n\`\`\``,
                        inline: true,
                    },
                ])
                .setFooter({ text: `GithubBuild: ${gitHash}` });

            return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your command.');
        }
    },
};
