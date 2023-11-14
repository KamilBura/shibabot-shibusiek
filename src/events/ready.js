const { log } = require('@functions/consoleLog');
const config = require('@config/config');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        log(`Bot is logged as ${client.user.tag}`, 'info');

        updatePresence(client);

        setInterval(() => {
            updatePresence(client);
        }, 10 * 60 * 1000);
    },
};

function updatePresence(client) {
    client.user.setPresence({
        activities: [{ 
          name: "Wandering... 🐕",
          type: ActivityType.Playing
        }],
        status: "idle"
    })

    log('Presence updated', 'info');
}