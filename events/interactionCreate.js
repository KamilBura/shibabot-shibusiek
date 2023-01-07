module.exports = (client, interaction) => {
    if (!interaction.isCommand()) {
        let command = client.slashCommands.find(interaction.commandName);

    } return;
};

// WILL BE EXTENDED TOMORROW