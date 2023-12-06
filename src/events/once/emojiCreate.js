const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'emojiCreate',
    once: false,
    execute(client, emoji) {
        try {
            const emojiLogId = config.ChannelsLogs.emojiLog;

            const logChannel = emoji.guild.channels.cache.get(emojiLogId);

            var date = Date.now();

            const emojiCreate = new EmbedBuilder()
              .setColor(config.Embeds.colors.green)
              .setAuthor({
                name: `${client.user.username} | New Emoji Added`,
                iconURL: client.user.displayAvatarURL({ dynamic: 4096 }),
              })
              .setThumbnail(emoji.url)
              .addFields(
                { name: `Name`, value: `${emoji.name}`, inline: false },
                { name: `ID`, value: `${emoji.id}`, inline: false },
                { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: false }
              );

            if (logChannel) {
                logChannel.send({ embeds: [emojiCreate] });
                log('emoji create event logged', 'events');
            } else {
                log({ text: `An error occurred while logging emoji create event`});
            }
        } catch (error) {
            log({ text: `An error occurred while logging emoji create event ${error}`});
            console.error(error);
        }
    },
};