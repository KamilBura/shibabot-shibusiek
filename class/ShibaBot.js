// Import required modules and classes from discord.js
const { Client, Partials, Collection, GatewayIntentBits, ActivityType} = require("discord.js");

// Import Modules "export.module"
const Logger = require("../module/CommandLog");
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
        // Command storage 
        commands: [],
        commandIndex: new Collection(),
        //slashCommand: new Collection(),
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
                //GatewayIntentBits.MessageContent,
                //GatewayIntentBits.GuildInvites,
                //GatewayIntentBits.GuildMembers,
                //GatewayIntentBits.GuildPresences,
                //GatewayIntentBits.GuildMessageReactions,
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

        this.database = mongoose.schemas;
    }

    // Method to start the bot
    start = async () => {
        
        // Log in to Discord using the provided token
        try {
            await this.login(process.env.CLIENT_TOKEN || config.token);
            Logger.log("Bot Starting...");
        } catch(error) {
            Logger.log("Error starting bot: " + error.message);
        }
        
        // Initialize command handlers, event handlers, and mongoose
        commands(this);
        events(this);
        components(this);

        // If the 'deploy' configuration is enabled, run the deploy handler
        if (config.deploy) deploy(this, config);


    };

    getCommand(invoke) {
        const index = this.commandIndex.get(invoke.toLowerCase());
        return index !== undefined ? this.commands[index] : undefined;
    }


}

// Export the ShibaBot class to be used in other modules
module.exports = ShibaBot;