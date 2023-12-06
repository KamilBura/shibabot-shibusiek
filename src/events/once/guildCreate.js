const { log } = require('../../functions/consoleLog');
const { createServerTable } = require('../../database/dbManager');

module.exports = {
    name: 'guildCreate',
    async execute(guild, client) {
        try {
            await createServerTable(guild);
            log(`${client.user.tag} has joined a new server: ${guild.name} (${guild.id}) - ${new Date().toISOString()}`, 'info');
        } catch (error) {
            log(error, 'error');
        }
    },
};