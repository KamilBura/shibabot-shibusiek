const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = (client) => {
    const eventsDir = join(__dirname, '../events');
    
    for (const dir of readdirSync(eventsDir)) {
        for (const file of readdirSync(eventsDir + '/' + dir).filter((f) => f.endsWith('.js'))) {
            const module = require(eventsDir + '/' + dir + '/' + file);

            if (!module) continue;

            if (!module.event || !module.run) {
                client.warn('Unable to load the event ' + file + ' due to missing \'name\' or/and \'run\' properties.');

                continue;
            };

            client.log('Loaded new event: ' + file);

            if (module.once) {
                client.once(module.event, (...args) => module.run(client, ...args));
            } else {
                client.on(module.event, (...args) => module.run(client, ...args));
            };
        };
    };
};