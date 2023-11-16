/**********************************************
 * Import Local Modules
 **********************************************/
const { log } = require('@functions/consoleLog');
const config = require('./src/config/config');
const loadEvents = require('@handlers/eventHandler');
const slashCommandHandler = require('@handlers/slashCommandHandler');
const deployCommands = require('@functions/deployCommands');
//const stalkingManager = require('@functions/stalkingManager');

/**********************************************
 * Import NPM Modules (Node.js)
 **********************************************/
const Discord = require('discord.js');

require('dotenv').config();

/**********************************************
 * Main Discord Bot function
 **********************************************/
const client = new Discord.Client({
    partials: [
      Discord.Partials.Channel, 
      Discord.Partials.GuildMember, 
      Discord.Partials.Message, 
      Discord.Partials.Reaction, 
      Discord.Partials.User
    ],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
    ],
});

// Command Deploy
if (config.Handlers.deploy) {
  deployCommands(config.Bot.clientID, null, config.Bot.token);
}

/**********************************************
 * Handlers to execute functions
 *? - SlashCommandHandler
 *? - EventHandler
 **********************************************/
client.on('interactionCreate', slashCommandHandler);
loadEvents(client);

// Bot Login
client.login(process.env.TOKEN || config.Bot.token);

// Error Handlers
process.on('unhandledRejection', (error) => {
    log(`Unhandled Rejection: ${error}`, 'error');
    log(error, 'error'); // Log the full error object for debugging
  });
  
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error}`, 'error');
    log(error, 'error'); // Log the full error object for debugging
  });
