const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: 'messageDelete',
    once: false,
    execute(message, client) {
        try {
            // Check if the client or message is undefined
            if (!client || !client.guilds || !client.guilds.cache || !message) {
                console.log('Received messageDelete event, but client or message is undefined.');
                return;
            }

            // Ignore message deletions from bots
            if (message.author && message.author.bot) {
                // Ignore messages sent by bots
                return;
            }
            // Get the log channel ID from your configuration
            const messageLogId = config.ChannelsLogs.messageLog;

            // Find the log channel by ID
            const logChannel = client.guilds.cache
                .map((guild) => guild.channels.cache.get(messageLogId))
                .find((channel) => channel);

            var date = Date.now();

            const messageDelete = new EmbedBuilder()
                  .setColor(config.Embeds.colors.red)
                  .setAuthor({
                    name: `Message has been deleted`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setThumbnail(
                    "https://cdn.discordapp.com/emojis/830790543659368448.webp?size=96&quality=lossless"
                  )
                  .setDescription(
                    [
                      `### User Information`,
                      `Name: **${message.author.username}**`,
                      `Mention: <@${message.author.id}>`,
                      `ID: **${message.author.id}**`,
                    ].join("\n")
                  )
                  .addFields(
                    {
                      name: `Message`,
                      value: message.content || 'No content', // Use message.content or a fallback if it's empty
                      inline: true,
                    },
                    {
                      name: `In`,
                      value: `<#${message.channel.id}>`,
                      inline: true,
                    },
                    { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                  );

            // Check if the log channel is found
            if (logChannel && message) {
                                       
                // Send the embed to the log channel
                logChannel.send({ embeds: [messageDelete] });
                log('Message delete event logged successfully.', 'info');
            } else {
                log('An error occurred while logging message delete event or message is undefined', 'error');
            }
        } catch (error) {
            console.error(error);
            log(`An error occurred while logging message delete event: ${error}`, 'error');
        }
    },
};
