const { ChannelType, Message } = require('discord.js');
const config = require('../../config/config');
const GuildSchema = require('../../schemas/GuildSchema');
const ShibaBot = require('../../class/ShibaBot');

module.exports = {
    event: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
    },
};
