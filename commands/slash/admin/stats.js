const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format");
const os = require("os");
const config = require("../../../config/config");


module.exports = {
    structure: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get information about the bot (BOT OWNER ONLY)"),
    run: async (client, interaction) => {

        if (!config.adminIds.includes(interaction.user.id)) {
            const adminEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Access Denied")
                .setDescription("This command is only available to administrators of the bot.")
                .setFooter({ text: "You don't have permission to use this command." });
            return interaction.reply({ embeds: [adminEmbed], ephemeral: true });
        }

        const osversion = os.platform() + " " + os.release();

        const nodeVersion = process.version;

        const runtime = moment
            .duration(client.uptime)
            .format("d[ Days]-h[ Hrs]-m[ Mins]-s[ Secs]");

        var systemuptime = moment
            .duration(os.uptime() * 1000)
            .format("d[ Days]-h[ Hrs]-m[ Mins]-s[ Secs]");
        
        // Bot Build state
        //let gitHash = "unkown";
        //try {
        //    gitHash = require("child_process")
        //        .execSync("git rev-parse HEAD")
        //        .toString()
        //        .trim();
        //} catch (error) {
        //    gitHash = "unknown";
        //}

        const statsEmbed = new EmbedBuilder()
            .setTitle(`${ client.user.username } Information`)
            .setColor(config.embedColor)
            .setDescription(`\`\`\`yml\nName: ${ client.user.username }#${ client.user.discriminator } [${ client.user.id }]\nAPI: ${ client.ws.ping }ms\nRuntime: ${ runtime }\`\`\``,)
            .setFields([
                {
                    name: `💚Lavalink stats`,
                    value: `\`\`\`yml\nUptime: SOON!\nRAM: SOON!\nMusicPlayers: SOON!\`\`\``,
                    inline: true,
                },
                {
                    name: "❤️Bot stats",
                    value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size} \nNodeJS: ${ nodeVersion }\nShibaBot: v${ require("../../../package.json").version} \`\`\``,
                    inline: true,
                },
                {
                    name: "💻System stats",
                    value: `\`\`\`yml\nOS: ${ osversion }\nUptime: ${ systemuptime }\n\`\`\``,
                    inline: true,
                },
            ])
            .setFooter({ text: `GithubBuild: SOON!` });
            return interaction.reply({ embeds: [statsEmbed], ephemeral: false});


    }
};
