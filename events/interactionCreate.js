// Exportujemy Modul do clienta
module.exports = (client, interaction) => {
    // Jesli interakcja jest komenda
    if (!interaction.isCommand()) {
        // Szukamy odpowiedniej komendy za pomoca metody "find" na tablicy "client.slashCommands"
        let command = client.slashCommands.find(
            // Sprawdzamy czy wlasciwosc "name" obiektu "x" jest rowna nazwie komendy uzytej przez uzytkownika
            (nameCheck) => nameCheck.name === interaction.commandName,

        );
        // Sprawdzanie czy komenda ma podmiot "run"
        if (!command || !command.run) {
            return interaction.reply("The command you used doesn't exist or not respond to the run function!");
        }
        // Jesli zostanie wykryte, ze interakcja to komenda, zostanie zwiekszona liczba wywolan komend o 1
        client.commandsRange++;
        // Uruchamiamy funkcje "run" zdefinowana dla danej komendy
        /**
         * Funckaj "run" jest funkcja, ktora zawiera logike dla danej komendy i jest uruchomiana, gdy uzytkownik wprowadza komende
         */
        command.run(client, interaction, interaction.options);
      // Instrukcja zostaje przerwana i program wraca do miejsca, w ktorym zostala wywolana
    } return;
};

