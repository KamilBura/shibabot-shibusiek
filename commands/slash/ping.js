const { MessageEmbed } = require('discord.js');
const { LoadCommandsSettings } = require('../../structures/ShibaBot'); 

const command = new LoadCommandsSettings()
    .setName("ping")
    .setDescription("Ping | Look at the latency.")
    .setRun(async (client, interaction,) => {
        let message = await interaction.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription("⬜ | Looking at the Connection...")
            ]
        });


    })

module.exports = command;