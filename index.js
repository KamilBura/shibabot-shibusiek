/**********************************************
 * Import Local Modules
 **********************************************/
const { log } = require('./src/functions/consoleLog');
const config = require('./src/config/config');
const loadEvents = require('./src/handlers/eventHandler');
const deployCommands = require('./src/functions/deployCommands');
const commandHandler = require('./src/handlers/commandHandler');
const db = require('./src/database/dbManager');
//const ReactionRoleManager = require('./src/components/reactionRoleManager');
//const stalkingManager = require('./src/functions/stalkingManager');

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
        Discord.GatewayIntentBits.MessageContent,
    ],
});

// Command Deploy
if (config.Handlers.deploy) {
  deployCommands(config.Bot.clientID, null, config.Bot.token);
}

/**********************************************
 * Handlers to execute functions
 *? - commandHandler
 *? - EventHandler
 **********************************************/

client.on('interactionCreate', commandHandler);

// Bot Login
client.login(process.env.TOKEN || config.Bot.token)
.then(() => {
  db.initializeDatabase();
  loadEvents(client);

  })
  .catch(error => {
    log(`Error logging in: ${error.message}`, 'error');
  });

// Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // You might want to add more sophisticated error handling or logging here
});
  
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error}`, 'error');
    log(error, 'error'); // Log the full error object for debugging
  });
