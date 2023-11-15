/**
 * 
 */
const { ActivityType } = require('discord.js');

module.exports = {
    Bot: {
        token: process.env.TOKEN || "",
        clientID: process.env.CLIENT_ID || "",
        clientSecret: process.env.CLIENT_SECRET || "",
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
