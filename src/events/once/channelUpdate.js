const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelUpdate',
    once: false,
    execute(oldChannel, newChannel, client) {
        try {
          if (newChannel.type === 0) {
                const channelLogId = config.ChannelsLogs.channelLog;

                const logChannel = newChannel.guild.channels.cache.get(channelLogId);

                var date = Date.now();

                const channelUpdateName = new EmbedBuilder()
                    .setColor(config.Embeds.colors.teal)
                    .setAuthor({
                      name: `${client.user.username} | New Channel Name`,
                      iconURL: client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setThumbnail(
                      "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
                    )
                    .setDescription(
                      [
                        `### Channel Information:`,
                        `Name: **${newChannel.name}**`,
                        `Mention: <#${newChannel.id}>`,
                        `ID: **${newChannel.id}**`,
                      ].join("\n")
                    )
                    .addFields(
                      { name: `From`, value: `${oldChannel.name}`, inline: true },
                      { name: `To`, value: `${newChannel.name}`, inline: true },
                      { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                    );


                const channelNSFW = new EmbedBuilder()
                    .setColor(config.Embeds.colors.teal)
                    .setAuthor({
                      name: `${client.user.username} | Channel Age Restriction Updated`,
                      iconURL: client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setDescription(
                      [
                        `### Channel Information:`,
                        `Name: **${newChannel.name}**`,
                        `Mention: <#${newChannel.id}>`,
                        `ID: **${newChannel.id}**`,
                      ].join("\n")
                    )
                    .addFields(
                      {
                        name: `Old Restriction`,
                        value: `${oldChannel.nsfw ? "Enabled :white_check_mark:" : "Disabled :x:"}`,
                        inline: true,
                      },
                      {
                        name: `New Restriction`,
                        value: `${newChannel.nsfw ? "Enabled :white_check_mark:" : "Disabled :x:"}`,
                        inline: true,
                      }
                    )
                    .setTimestamp();


                const channelUpdateParent = new EmbedBuilder()
                    .setColor(config.Embeds.colors.teal)
                    .setAuthor({
                      name: `${client.user.username} | Channel Category Changed`,
                      iconURL: client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setThumbnail(
                      "https://cdn.discordapp.com/emojis/1138488289846890557.webp?size=96&quality=lossless"
                    )
                    .setDescription(
                      [
                        `### Channel Information:`,
                        `Name: **${newChannel.name}**`,
                        `Mention: <#${newChannel.id}>`,
                        `ID: **${newChannel.id}**`,
                      ].join("\n")
                    )
                    .addFields(
                      { name: `From`, value: `${oldChannel.parent || "None :x:"}`, inline: true },
                      { name: `To`, value: `${newChannel.parent || "None :x:"}`, inline: true },
                      { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                    );
              

                const channelUpdateTopic = new EmbedBuilder()
                    .setColor(config.Embeds.colors.teal)
                    .setAuthor({
                      name: `${client.user.username} | Channel Topic Changed`,
                      iconURL: client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setThumbnail(
                      "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
                    )
                    .setDescription(
                      [
                        `### Channel Information:`,
                        `Name: **${newChannel.name}**`,
                        `Mention: <#${newChannel.id}>`,
                        `ID: **${newChannel.id}**`,
                      ].join("\n")
                    )
                    .addFields(
                      {
                        name: `From`,
                        value: `${oldChannel.topic || `None :x:`}`,
                        inline: true,
                      },
                      { name: `To`, value: `${newChannel.topic || `None :x:`}`, inline: true },
                      { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                    );


                const channelUpdateRatelimitPerUser = new EmbedBuilder()
                    .setColor(config.Embeds.colors.teal)
                    .setAuthor({
                      name: `${client.user.username} | Channel Slowmode Changed`,
                      iconURL: client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setThumbnail(
                      "https://cdn.discordapp.com/emojis/785483969453883432.webp?size=96&quality=lossless"
                    )
                    .setDescription(
                      [
                        `### Channel Information:`,
                        `Name: **${newChannel.name}**`,
                        `Mention: <#${newChannel.id}>`,
                        `ID: **${newChannel.id}**`,
                      ].join("\n")
                    )
                    .addFields(
                      {
                        name: `Old Slowmode`,
                        value: `${oldChannel.rateLimitPerUser || "None :x:"}`,
                        inline: true,
                      },
                      {
                        name: `New Slowmode`,
                        value: `${newChannel.rateLimitPerUser || "None :x:"}`,
                        inline: true,
                      },
                      { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                    );

                try {

                  if (logChannel) {                   
                    if (oldChannel.name !== newChannel.name) {
                      logChannel.send({ embeds: [channelUpdateName] });
                      log('channel name update logged', 'events');
                    } else if (oldChannel.nsfw !== newChannel.nsfw) {
                      logChannel.send({ embeds: [channelNSFW] });
                      log('channel nsfw settings change logged', 'events');
                    } else if (oldChannel.parentID !== newChannel.parentID) {
                      logChannel.send({ embeds: [channelUpdateParent] });
                      log('channel category change logged', 'events');
                    } else if (oldChannel.type !== newChannel.type) {
                      logChannel.send({ embeds: [channelUpdateTopic] });
                      log('channel topic name logged', 'events');
                    } else if (oldChannel.rawPosition !== newChannel.rawPosition) {
                      logChannel.send({ embeds: [channelUpdateRatelimitPerUser] });
                      log('channel rate limit logged', 'events');
                    }
                    
                  } else {
                    log({ text: `An error occurred while logging channel update event`}, 'events');
                  }
                } catch (error) {
                  console.error(error);
                }
                }
        } catch (error) {
            log({ text: `An error occurred while logging channel update event ${error}`}, 'events');
        }
    },
};