// src/commands/ping.js

const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping command to check bot latency.')
    .toJSON();

const execute = (interaction) => {
    interaction.reply(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms.`);
};

module.exports = {
    data,
    execute,
};
