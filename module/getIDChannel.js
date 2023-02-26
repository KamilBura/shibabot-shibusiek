// Exportujemy Moduly z dwomai argumentami "client" i "interaction"
//? interaction = Discord Slash Command Interaction
//? client =  /structures/ShibaBot.js

module.exports = async (client, interaction) => {
    // Robimy komende obietnice, ktora zostanie rozwiazana z obiektem "voiceChannel" = Kanal Glosowy
    return new Promise(async (result) => {
        // Sprawdzamy czy Osoba jest na Kanale Glosowy = false
        if (!interaction.member.voice.channel) {
            // Jezeli Osoba nie jest wysylamy odpowiedz
            await interaction.reply({
                embeds: [client.errorEmbed("Woof! 🐶 You must be in a voice channel to use commands!"),],
            });
            return result(false);
            // jezeli guild.me.voice channel i member.voice.channel id !== (negacja, Porownanie) nie jest takie same
        } if (
            interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id
        ) {
            // Jesli osoba jest na innym Kanale glosowym niz bot, wysylamy odpowiedz
            await interaction.reply({
                embeds: [client.errorEmbed("Woof! 🐶 You must be in the same voice channel as me to use commands!"),],
            });
            return result(false);
            // Sprawdzamy czy Bot ma dostep do kanalu glosowego w ktorym znajude sie Osoba
        } if (!interaction.member.voice.channel.joinable) {
            await interaction.reply({
                embeds: [client.errorEmbed("Woof! 🐶 I don't habe permission to join you!"),],
            });
            return result(false);
            // Jezeli uzytkownik posiada permissje "Administrator", Nie sprawdzamy czy Osoba znajduje sie na tym samym kanale glosowym
        } if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            
            if (!interaction.member.voice.channel) {
                await interaction.reply({
                    embeds: [client.errorEmbed("Woof! 🐶 You must be in a voice channel to use commands!"),],
                });
                return result(false);

            } if (interaction.guild.me.voice.channel && interaction.member.voice.channel !== interaction.guild.me.voice.channel.id) {
                return result(true);

            } if (!interaction.member.voice.channel.joinable) {
                await interaction.reply({
                    embeds: [client.errorEmbed("Woof! 🐶 I don't habe permission to join you!"),],
                });
                return result(false);
            }
        }

        result(interaction.member.voice.channel);
    });

};