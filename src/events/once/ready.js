const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { createServerTable } = require('../../database/dbManager');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        log(`Bot is logged as ${client.user.tag}`, 'info');

        updatePresence(client);

        setInterval(() => {
            updatePresence(client);
        }, 10 * 60 * 1000);

        client.guilds.cache.forEach((guild) => {
             createServerTable(guild);
        });

        //showClientInfo(client.user.tag, client.guilds.cache.size, client.users.cache.size);
    },
};

function updatePresence(client) {
    client.user.setPresence({
        activities: [{ 
          name: config.Presence.text,
          type: config.Presence.type,
        }],
        status: config.Presence.status
    })

    log('Presence updated', 'info');
}