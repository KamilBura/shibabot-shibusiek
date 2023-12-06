const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: 'guildMemberRemove',
    once: false,
    execute(member) {
        try {
            const leaveLogId = config.ChannelsLogs.leaveLog;

            const logChannel = member.guild.channels.cache.get(leaveLogId);

            var date = Date.now();

            const guildMemberRemove = new EmbedBuilder()
              .setColor(config.Embeds.colors.red)
              .setAuthor({
                name: `${member.user.username} | Left the server`,
                iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
              })
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
              .setDescription([`**${member.user.username}** left the server`].join("\n"))
              .addFields(
                { name: `Name`, value: `${member.user.username}`, inline: true },
                { name: `ID`, value: `${member.user.id}`, inline: true },
                { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
              );

            if (logChannel) {
                logChannel.send({ embeds: [guildMemberRemove] });
            } else {
                log({ text: `An error occurred while logging guild member remove event`});
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging guild member remove event ${error}`});
        }
    },
};