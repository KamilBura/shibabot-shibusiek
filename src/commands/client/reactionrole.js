const { SlashCommandBuilder } = require('@discordjs/builders');
const reactionRoleManager = require('../../components/reactionRoleManager');
const dbManager = require('../../database/dbManager');

const initializeDatabaseAndReactionRoleManager = async (interaction) => {
    await dbManager.initializeDatabase();
    // No need to create a new instance, use the existing instance
    return reactionRoleManager;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Manage reaction roles')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a reaction role')
                .addStringOption(option => option.setName('messageid').setDescription('ID of the message'))
                .addRoleOption(option => option.setName('role').setDescription('Role to assign'))
                .addStringOption(option => option.setName('emoji').setDescription('Emoji to react with'))
                .addBooleanOption(option => option.setName('unreact').setDescription('Remove role on unreact'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete reaction roles for a message')
                .addStringOption(option => option.setName('messageid').setDescription('ID of the message'))
                .addRoleOption(option => option.setName('role').setDescription('Role to remove'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Display reaction role information')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const messageId = interaction.options.getString('messageid');
            const role = interaction.options.getRole('role');
            const emoji = interaction.options.getString('emoji');
            const unreact = interaction.options.getBoolean('unreact');

            if (!interaction.guild) {
                console.error('Guild is undefined in the interaction object.');
                return;
            }

            // Use the existing instance of reactionRoleManager
            const reactionRoleManager = await initializeDatabaseAndReactionRoleManager(interaction);

            // Add reaction role
            reactionRoleManager.addReactionRole(interaction.client, interaction.guild.id, messageId, role, emoji, unreact);

            await interaction.reply('Reaction role added successfully!');
        } else if (subcommand === 'delete') {
            const messageId = interaction.options.getString('messageid');
            const role = interaction.options.getRole('role');
            
            // Use the existing instance of reactionRoleManager
            const reactionRoleManager = await initializeDatabaseAndReactionRoleManager(interaction);

            // Delete reaction roles for a message
            reactionRoleManager.deleteReactionRole(interaction.client, messageId, role);

            await interaction.reply('Reaction roles deleted successfully!');
        } else if (subcommand === 'info') {
            // Use the existing instance of reactionRoleManager
            const reactionRoleManager = await initializeDatabaseAndReactionRoleManager(interaction);

            // Display reaction role information
            const reactionRoles = reactionRoleManager.getReactionRoles(interaction.client, interaction.guild.id);
            const response = `Current Reaction Roles:\n${reactionRoles.join('\n')}`;

            await interaction.reply(response);
        }
    },
};
