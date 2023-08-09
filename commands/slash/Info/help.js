const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ShibaBot = require('../../../class/ShibaBot');
const config = require('../../../config/config');
const GuildSchema = require('../../../schemas/GuildSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all the possible commands!'),
    /**
     * @param {ShibaBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {[]} args 
     */
    run: async (client, interaction, args) => {

        await interaction.deferReply();

        const mapIntCmds = client.applicationcommandsArray.map((v) => `\`/${v.name}\`: ${v.description}`);
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Help command')
                    .addFields(
                        { name: 'Slash commands', value: `${mapIntCmds.join('\n')}` }
                    )
            ]
        });

    }
};
