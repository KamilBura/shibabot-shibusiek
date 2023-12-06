// commands/utility/help.js
const { EmbedBuilder } = require('discord.js');
const commandCategories = require('../../helpers/commandCategories');

module.exports = {
    data: {
        name: 'help',
        description: 'Display help information for commands.',
        options: [
            {
                name: 'category',
                description: 'Display commands in a specific category.',
                type: 3, // STRING
                required: true,
                choices: Object.entries(commandCategories)
                    .filter(([key, value]) => value.name)
                    .map(([key, value]) => ({
                        name: value.name,
                        value: key,
                    })),
            },
        ],
    },
    execute: async (interaction, client) => {
        try {
            const category = interaction.options.getString('category');
            
            // Check if the category exists
            if (!commandCategories[category]) {
                return interaction.reply(`Invalid category: ${category}`);
            }

            // Get commands from the specified category
            const categoryCommands = commandCategories[category].commands;

            // Log the contents of categoryCommands for debugging
            //console.log('categoryCommands:', categoryCommands);

            // Log the properties of each command for debugging
            //categoryCommands.forEach(({ name, command }) => {
            //    console.log(`Command: ${name}, Command:`, command);
            //    console.log(`Command: ${name}, Command Data:`, command && command.data);
            //});


            // Check if commands exist in the category
            if (!categoryCommands || categoryCommands.length === 0) {
                return interaction.reply(`No commands found in the ${commandCategories[category].name} category.`);
            }

            // Extract name and description from each command
            const commandsInfo = categoryCommands.map(({ name, command }) => ({
                name,
                description: command.data && command.data.description
                    ? command.data.description
                    : 'No description available.',
            }));

            const embed = new EmbedBuilder()
                .setColor('#3498db') // You can change the color
                .setTitle(`Commands in the ${commandCategories[category].name} category`)
                .setDescription(commandsInfo.map(command => `\`${command.name}\`: ${command.description}`).join('\n'))
                .setFooter({text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()})
                .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
        }
    },
};
