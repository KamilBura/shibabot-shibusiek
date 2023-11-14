const fs = require('fs');
const path = require('path');

function loadEvents(client) {
    const eventsDir = path.join(__dirname, '../events');

    const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.join(eventsDir, file));
        const eventName = file.split('.')[0];

        if (event.once) {
            client.once(eventName, (...args) => event.execute(...args, client));
        } else {
            client.on(eventName, (...args) => event.execute(...args, client));
        }
    }
}

module.exports = loadEvents;