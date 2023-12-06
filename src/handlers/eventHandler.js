const fs = require('fs');
const path = require('path');
const { log } = require('../functions/consoleLog');

function loadEvents(client) {
    const eventsDir = path.join(__dirname, '../events');

    // Separate events into 'once' and 'on' folders
    const onceEventsDir = path.join(eventsDir, 'once');
    const onEventsDir = path.join(eventsDir, 'on');

    // Function to load events from a folder
    const loadEventsFromFolder = (folder) => {
        const eventFiles = fs.readdirSync(folder).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            try {
                const event = require(require.resolve(path.join(folder, file)));
                const eventName = file.split('.')[0];

                if (event.once) {
                    client.once(eventName, (...args) => event.execute(...args, client));
                    log(`Successfully loaded Once Event: ${eventName}`, 'events');
                } else {
                    client.on(eventName, (...args) => event.execute(...args, client));
                    log(`Successfully loaded On Event: ${eventName}`, 'events');
                }
            } catch (error) {
                log(`Error loading event ${file}: ${error.stack || error.message}`, 'error');
            }
        }
    };

    // Load events from 'once' folder
    loadEventsFromFolder(onceEventsDir);

    // Load events from 'on' folder
    loadEventsFromFolder(onEventsDir);
}

module.exports = loadEvents;
