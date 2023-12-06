const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: 'guildBanRemove',
    once: false,
    execute(ban) {
        try {
            const unbanLogId = config.ChannelsLogs.unbanLog;

            const logChannel = ban.guild.channels.cache.get(unbanLogId);

            const guildBanRemove = new EmbedBuilder()
                    .setColor(config.Embeds.colors.green)
                    .setAuthor({
                      name: `${client.user.username} | Member Unbanned`,
                      iconURL: client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
                    .setDescription(
                      [
                        `**${member.user.username}** has been unbanned`,
                        ``,
                        `**User:**`,
                        `**Name:** ${member.user.username}`,
                        `**ID:** ${member.user.id}`,
                      ].join("\n")
                    )
                    .setTimestamp();

            if (logChannel) {
                log('guild ban remove event logged', 'events');
                logChannel.send({ embeds: [guildBanRemove] });
            } else {
                log({ text: `An error occurred while logging guild ban remove event`});
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging guild ban remove event ${error}`});
        }
    },
};