const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'emojiUpdate',
    once: false,
    execute(client, oldEmoji, newEmoji) {
        try {
            const emojiLogId = config.ChannelsLogs.emojiLog;

            const logChannel = emoji.guild.channels.cache.get(emojiLogId);

            const emojiUpdate = new EmbedBuilder()
                .setColor(config.Embeds.colors.teal)
                .setAuthor({
                  name: `${client.user.username} | Emoji Name Changed`,
                  iconURL: client.user.displayAvatarURL({ size: 4096 }),
                })
                .setThumbnail(newEmoji.url)
                .addFields(
                  { name: `New Name`, value: `${oldEmoji.name}`, inline: false },
                  { name: `Old Name`, value: `${newEmoji.name}`, inline: false },
                  { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: false }
                );
      

            if (logChannel) {
                logChannel.send({ embeds: [emojiUpdate] });
                log('emoji update event logged', 'events');
            } else {
                log({ text: `An error occurred while logging emoji create event`});
            }
        } catch (error) {
            log({ text: `An error occurred while logging emoji create event ${error}`});
            console.error(error);
        }
    },
};