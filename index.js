/**
 * Import Local Modules
 */
const { log } = require('@functions/consoleLog');
const config = require('./src/config/config');
const loadEvents = require('@handlers/eventHandler');
const slashCommandHandler = require('@handlers/slashCommandHandler');
const deployCommands = require('@functions/deployCommands');
const stalkingManager = require('@functions/stalkingManager');

/**
 * Import NPM Modules
 */
const Discord = require('discord.js');

require('dotenv').config();

/**
 * Execute Discord Bot
 */
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




client.on('interactionCreate', slashCommandHandler);

deployCommands(config.Bot.clientID, null, config.Bot.token);

loadEvents(client);

client.login(process.env.TOKEN || config.Bot.token);


process.on('unhandledRejection', (error) => {
    log(`Unhandled Rejection: ${error}`, 'error');
    console.error(error); // Log the full error object for debugging
  });
  
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error}`, 'error');
    console.error(error); // Log the full error object for debugging
  });
