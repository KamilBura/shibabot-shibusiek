const { Client, Partials, Collection, GatewayIntentBits} = require("discord.js");

const CommandLog = require("../module/CommandLog");
const path = require("path");
const config = require('../config/config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");

class ShibaBot extends Client{
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection()
    }
    applicationcommandsArray = [];

    constructor(
        loadIntents = {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ],
            partials: [
                Partials.Channel,
                Partials.User,
                Partials.Message,
            ]
        }
    ) {
        super(loadIntents);

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');

        const logFileName = `logs-${formattedDate}.log`;
        const logFilePath = path.join(__dirname, "..", "/log", logFileName);

        this.CommandLog = new CommandLog(logFilePath);
    }

    log(output) {
        this.CommandLog.log(output);
    }

    warn(output) {
        this.CommandLog.warn(output);
    }

    error(output) {
        this.CommandLog.error(output);
    }

    lavalink(output) {
        this.CommandLog.lavalink(output);
    }

    musicplayer(output) {
        this.CommandLog.musicplayer(output);
    }

    
1
    start = async () => {
        
        commands(this);
        events(this);
        mongoose(this);

        await this.login(process.env.CLIENT_TOKEN || config.token);

        if (config.deploy) deploy(this, config);


    };
}

module.exports = ShibaBot;