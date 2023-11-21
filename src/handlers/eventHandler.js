const fs = require('fs');
const path = require('path');
const { log } = require('@functions/consoleLog');

function loadEvents(client) {
    const eventsDir = path.join(__dirname, '../events');

    const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const event = require(path.join(eventsDir, file));
            const eventName = file.split('.')[0];

            if (event.once) {
                client.once(eventName, (...args) => event.execute(...args, client));
                log(`Successfully loaded Event: /${eventName}`);
            } else {
                client.on(eventName, (...args) => event.execute(...args, client));
                log(`Successfully loaded Event: /${eventName}`);
            }
        } catch (error) {
            log(`Error loading event ${file}: ${error.message}`, 'error');
        }
    }
}

module.exports = loadEvents;