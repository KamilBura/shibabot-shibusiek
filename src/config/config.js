module.exports = {
    Bot: {
        token: process.env.TOKEN || 
        clientID: process.env.CLIENT_ID || 
        clientSecret: process.env.CLIENT_SECRET || 
        guildID: "1127685897631060021",
    },
    Logger: {
        logLevel: 'info', // Default log Level
        consolePrefix: '🐕ShibaBot',
        colors: {
            info: 'cyan',
            warn: 'yellow',
            error: 'red',
            handlers: 'green',
            util: 'blue',
            command: 'greenBright',
            check: 'blueBright',
            rest: 'redBright',
            database: 'magenta',
            events: 'greenBright',
        },
    },
    Handlers: {
        deploy: true,

    },
    stalkingManager: {
        maxStalksPerUser: 2,
    },
    Commands: {
    },
    Presence: {
        text: "Wandering... 🐕",
        type: 3, // 0 = PLAYING, 1 = STREAMING, 2 = LISTENING, 3 = WATCHING, 4 = CUSTOM
        url: "https://github.com/KamilBura/shibabot-shibusiek/tree/pre-alpha",
        status: "online",
    },
    Database: {
        uri: "mongodb+srv://admin:admin@dc.q0vfnxx.mongodb.net/?retryWrites=true&w=majority"
    },
    ChannelsLogs: {
        channelLog: "1173946832536223775",
        emojiLog: "1173946832536223775",
        banLog: "1173946832536223775",
        unbanLog: "1173946832536223775",
        joinLog: "1173946832536223775",
        leaveLog: "1173946832536223775",
        messageLog: "1173946832536223775",
        voiceLog: "1173946832536223775"
      },
      Embeds: {
        colors: {
            blue: '#3498db',
            green: '#2ecc71',
            red: '#e74c3c',
            yellow: '#f1c40f',
            purple: '#9b59b6',
            orange: '#e67e22',
            teal: '#1abc9c',
            pink: '#e91e63',
        },
    },
};