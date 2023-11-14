/**
 * 
 */
const { ActivityType } = require('discord.js');

module.exports = {
    Bot: {
        token: process.env.TOKEN || "MTA1NjYxNDc0MzcwMTQ1NDkxOQ.Ghv16M.USejYxxHp9h91I52vkRsxAn30SP5Dkwb2SWLFk",
        clientID: process.env.CLIENT_ID || "1056614743701454919",
        clientSecret: process.env.CLIENT_SECRET || "diWvrvNn53PqEcMV6iaPMUjiOdTcvl26",
    },
    Logger: {
        logLevel: 'info',
        consolePrefix: '🐕ShibaBot',
        colors: {
            info: 'cyan',
            warn: 'yellow',
            error: 'red',
            handlers: 'green',
            util: 'blue',
        },
    },
    Handlers: {

    },
    Commands: {
        prefix: '!bot',
    },
    Presence: {
        text: "Wandering... 🐕",
        url: "",
        status: "idle",
    },
};