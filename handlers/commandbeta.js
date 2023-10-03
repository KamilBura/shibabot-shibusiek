const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require('../config/config');
const { parsePermissions } = require("../module/Utils");
const { getCommand } = require("../class/ShibaBot");


// Import required modules
const { readdirSync } = require('fs');
const { join } = require('path');
const logger = require("../module/CommandLog");

// Export a function that loads and sets up slash command modules
module.exports = (client) => {
    // Define the directory path where command files are located
    const commandsPath = join(__dirname, '../commands');

    //?console.log('Starting command loading...'); // Add this console log

    // Loop through each type of command directory
    for (const type of readdirSync(commandsPath)) {
        //?console.log('Processing type:', type); // Add this console log

        // Loop through each directory in the current type
        for (const dir of readdirSync(commandsPath + '/' + type)) {
            //?console.log('Processing dir:', dir); // Add this console log

            // Loop through each command file in the current directory
            for (const file of readdirSync(commandsPath + '/' + type + '/' + dir).filter((f) => f.endsWith('.js'))) {
                //?console.log('Processing file:', file); // Add this console log

                // Import the command module from the command file
                const module = require(commandsPath + '/' + type + '/' + dir + '/' + file);

                // If module is missing, continue to the next file
                if (!module) continue;

                // Check if the required properties 'structure.name' and 'run' are present in the module
                if (!module.structure?.name || !module.run) {
                    logger.warn('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.');
                    continue;
                }

                // Use the getCommand function to retrieve the command object
                const command = getCommand(module.structure.name);
                if (!command) {
                    logger.warn('Command ' + module.structure.name + ' not found in the command handler.');
                    continue;
                };


                // Store the command in the interactioncommands collection
                client.collection.interactioncommands.set(module.structure.name, module);
                // Add the command structure to the applicationcommandsArray
                client.applicationcommandsArray.push(module.structure);

                // Log that a new command has been loaded
                logger.commandLoad('Loaded new command: ' + '../' + dir + '/ ' + file);
            }
        }
    }

    //?console.log('Command loading completed.'); // Add this console log
};
