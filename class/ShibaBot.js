// Import required modules and classes from discord.js
const { Client, Partials, Collection, GatewayIntentBits, ActivityType} = require("discord.js");

// Import Modules "export.module"
const CommandLog = require("../module/CommandLog");
const config = require('../config/config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");

// Node.js modules
const path = require("path");

// Define a class that extends the discord.js Client class
class ShibaBot extends Client{
    // Define collections and arrays to store command-related data
    collection = {
        interactioncommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection()
        }
    };
    applicationcommandsArray = [];

    // Constructor that sets up the bot and initializes the CommandLog
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
            ],
            presence: (config.presence),
        }
    ) {
        super(loadIntents);

        // Create a log file name based on the current date
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
        const logFileName = `logs-${formattedDate}.log`;

        // Define the path to the log file
        const logFilePath = path.join(__dirname, "..", "/log", logFileName);

        // Initialize the CommandLog instance
        this.CommandLog = new CommandLog(logFilePath);
    }

    // Log methods that use the CommandLog instance to log different types of information
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

    
    // Method to start the bot
    start = async () => {
        // Initialize command handlers, event handlers, and mongoose
        commands(this);
        events(this);
        components(this);
        mongoose(this);

        // Log in to Discord using the provided token
        await this.login(process.env.CLIENT_TOKEN || config.token);


        // If the 'deploy' configuration is enabled, run the deploy handler
        if (config.deploy) deploy(this, config);


    };
}

// Export the ShibaBot class to be used in other modules
module.exports = ShibaBot;