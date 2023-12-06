const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'emojiDelete',
    once: false,
    execute(client, emoji) {
        try {
            const emojiLogId = config.ChannelsLogs.emojiLog;

            const logChannel = emoji.guild.channels.cache.get(emojiLogId);

            var date = Date.now();

            const emojiDelete = new EmbedBuilder()
              .setColor(config.Embeds.colors.red)
              .setAuthor({
                name: `${client.user.username} | Emoji Removed`,
                iconURL: client.user.displayAvatarURL({ size: 4096 }),
              })
              .setThumbnail(emoji.url)
              .addFields(
                { name: `Name`, value: `${emoji.name}`, inline: false },
                { name: `ID`, value: `${emoji.id}`, inline: false },
                { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: false }
              );

            if (logChannel) {
                logChannel.send({ embeds: [emojiDelete] });
                log('emoji delete event logged', 'events');
            } else {
                log({ text: `An error occurred while logging emoji delete event`});
            }
        } catch (error) {
            log({ text: `An error occurred while logging emoji delete event ${error}`});
            console.error(error);
        }
    },
};