const config = require('../../config/config');
const { getSettings } = require("../../schemas/Guild");

module.exports = {
    event: 'interactionCreate',
    run: async (client, interaction, message) => {
        if (config.handler.commands.slash === false && interaction.isChatInputCommand()) return;
        if (config.handler.commands.user === false && interaction.isUserContextMenuCommand()) return;
        if (config.handler.commands.message === false && interaction.isMessageContextMenuCommand()) return;

        const command = client.collection.interactioncommands.get(interaction.commandName);

        if (!command) return;

        try {
            command.run(client, interaction);
        } catch (e) {
            client.error(e);
        };
    }
};