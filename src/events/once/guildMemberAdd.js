const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(member) {
        try {
            const joinLogId = config.ChannelsLogs.joinLog;

            const logChannel = member.guild.channels.cache.get(joinLogId);

            var date = Date.now();

            const guildMemberAdd = new EmbedBuilder()
              .setColor(config.Embeds.colors.purple)
              .setAuthor({
                name: `${member.user.username} has joined server`,
                iconURL: member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
              })
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 4096 }))
              .setDescription([`<@${member.user.id}> has joined the server`].join("\n"))
              .addFields(
                { name: `Name`, value: `${member.user.username}`, inline: true },
                { name: `ID`, value: `${member.user.id}`, inline: true },
                { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
              );

            if (logChannel) {
                log('guild member add events logged', 'events');
                logChannel.send({ embeds: [guildMemberAdd] });
            } else {
                log({ text: `An error occurred while logging guild member add event`});
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging guild member add event ${error}` });
        }
    },
};