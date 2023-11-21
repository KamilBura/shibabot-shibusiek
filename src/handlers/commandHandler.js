// src/handlers/commandLoader.js

const { log } = require('@functions/consoleLog');
const fs = require('fs');
const path = require('path');

const loadCommands = (commands, commandInfo) => {
    const commandFolders = fs.readdirSync(path.resolve(__dirname, `../commands/`));

    for (const folder of commandFolders) {
        const folderPath = path.resolve(__dirname, `../commands/${folder}`);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const commandFileName = path.parse(file).name;
                const commandFilePath = path.resolve(folderPath, file);

                // Log that the command has been loaded successfully
                log(`Loaded command: ${commandFileName} from file: ${commandFilePath}`, 'info');

                // Require and store the command for later execution
                const command = require(commandFilePath);

                // Check if the command has a data property with a description
                if (command.data && command.data.description) {
                    commands.set(commandFileName, command);
                    commandInfo.set(commandFileName, command.data.description);
                } else {
                    log(`Command ${commandFileName} is missing 'data' or 'description'. Skipping.`, 'warn');
                }
            }
        }
    }
};

module.exports = { loadCommands };
