const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: 'guildBanAdd',
    once: false,
    execute(ban) {
        try {
            const banLogId = config.ChannelsLogs.banLog;

            const logChannel = ban.guild.channels.cache.get(banLogId);

            const guildBanAdd = new EmbedBuilder()
                .setColor(config.Embeds.colors.pink)
                .setAuthor({
                  name: `${client.user.username} | Member Banned`,
                  iconURL: client.user.displayAvatarURL({ size: 4096 }),
                })
                .setThumbnail(
                  "https://cdn.discordapp.com/emojis/1117871692803494023.webp?size=96&quality=lossless"
                )
                .setDescription(
                  [
                    `**${member.user.username}** has been banned`,
                    ``,
                    `**Name:** ${member.user.username}`,
                    `**ID:** ${member.user.id}`,
                  ].join("\n")
                )
                .setFooter({
                  text: `Reason: ${reason || "None"}`,
                  iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                })
                .setTimestamp();

            if (logChannel) {
                log('guild ban add event logged', 'events');
                logChannel.send({ embeds: [guildBanAdd] });
            } else {
                log({ text: `An error occurred while logging guild ban add event`});
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging guild ban add event ${error}`});
        }
    },
};