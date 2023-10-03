// Import required modules
const { readdirSync } = require('fs');
const { join } = require('path');
const Logger = require("../module/CommandLog");

// Export a function that loads and sets up event handlers
module.exports = (client) => {
    // Define the directory path where event files are located
    const eventsDir = join(__dirname, '../events');

    // Loop through each directory in the events directory
    for (const dir of readdirSync(eventsDir)) {
        // Loop through each event file in the current directory
        for (const file of readdirSync(eventsDir + '/' + dir).filter((f) => f.endsWith('.js'))) {
            // Import the event module from the event file
            const module = require(eventsDir + '/' + dir + '/' + file);

            // If module is missing, continue to the next file
            if (!module) continue;

            // Check if the required properties 'event' and 'run' are present in the module
            if (!module.event || !module.run) {
                // Log a warning if the event module is missing properties
                Logger.warn('Unable to load the event ' + file + ' due to missing \'name\' or/and \'run\' properties.');

                continue;
            };

            // Log that a new event has been loaded
            Logger.eventLoad('Loaded new event: ' + '../' + dir + '/ ' + file);

            // Set up the event listener based on whether the event is 'once' or not
            if (module.once) {
                // If 'once' is true, use 'client.once' to listen for the event
                client.once(module.event, (...args) => module.run(client, ...args));
            } else {
                // If 'once' is not true, use 'client.on' to listen for the event
                client.on(module.event, (...args) => module.run(client, ...args));
            };
        };
    };
};