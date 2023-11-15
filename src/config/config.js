/**
 * 
 */
const { ActivityType } = require('discord.js');

module.exports = {
    Bot: {
        token: process.env.TOKEN || "MTA1NjYxNDc0MzcwMTQ1NDkxOQ.Gb7swD.Tn3doY5Q_pQy2kofOeTflDfilF74zrc7RYmYpU",
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
            command: 'greenBright',
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