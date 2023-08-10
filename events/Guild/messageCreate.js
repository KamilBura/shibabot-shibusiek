const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Embed } = require('discord.js');
const config = require('../../config/config');
const GuildSchema = require('../../schemas/GuildSchema');
const ShibaBot = require('../../class/ShibaBot');
const { platform, arch } = require("os");


module.exports = {
    event: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;

        const front = `^<@!?${client.user.id}>`;
        const chatmention = new RegExp(front + '$');
        const debugIDMention = new RegExp(front + " debug-id ([^\\s]+)");
        const invite = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&permissions=${config.inviteScopes.toString().replace(/,/g, "%20")}`;

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(5).setLabel("Invite me").setURL(invite),
            new ButtonBuilder().setStyle(5).setLabel("Support Server").setURL(`${config.supportServer}`)
        );

        if (message.content.match(chatmention)) {
            const mentionEmbed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setDescription(`My prefix on this server is \`/\` (Slash Command).\nTo get started you can type \`/help\` to see all my commands.\nIf you can't see it, Please [re-invite](invite) me with the correct permissions.`
                );

            message.channel.send({
                embeds: [mentionEmbed],
                components: [buttons],
            });
        }

        if (config.adminIds.includes(message.author.id)) {
            const m = message.content?.match(debugIDMention);
            const guildSettings = await GuildSchema.findOne({ guild: message.guild.id });
            const r = m[1]?.length ? guildSettings?.[m[1]] : null;
            message.channel.send(r?.length ? r : `${platform()} ${arch()}`)
        }

    },
};
