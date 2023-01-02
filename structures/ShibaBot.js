/**
 * Importujemy potrzebne klasy z biblioteki "discord.js"
 * `client` - uzywana do obslugi wydarzen, komunikacji z serwerami disocrd, itp.
 * W pliku **index.js** obiekt klienta zostaje utworzony za pomca struktury "ShibaBot"
 * Obiekt klienta jest uzywany w innych plikach aplikacji po jego zaimportowaniu i eksporcie za pomoca `module.exports`
 */
const { Client, IntentsBitField, Collection } = require('discord.js');
const ImportConfig = require('../utility/ImportConfig');
const CommandLog = require('../library/CommandLog');
const path = require('path');
const fs = require('fs');

// Nowa klasa o nazwie "ShibaBot", ktory rozszerza klase 'Client' z biblioteki discord.js
class ShibaBot extends Client {
    // tworzymy "consturctor", constructor sluzy do inicjalizacji nowo utworzonego obiektu poprzez ustawienie poczatkowych wartosci wlasciwosci
    constructor(
        // Ladujemy wszystkie Intents do jednej zmiennej "IntentsLoad" / Intents.FLAGS.GUILDS => Nie dziala - IntentsBitField.Flags.Guilds instead.
        IntentsLoad = {
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildMessages,
            ],
        }
    ) {
        // `super()` uzywane w klasach dziedziczacych (Rozszerza inna klase), w celu wywolania konstruktora klasy bazowej "Client" aka. "ShibaBot"
        super(IntentsLoad);

        // Funkcja "ImportConfig", Importuje Config z Pliku ../config.js do obiektu "ShibaBot" i wywoluje metode "build". Zwraca obietnice (promise).
        ImportConfig().then((botconfig) => {
            // Ustawia wlasciwosch "config" obiektu "ShibaBot" na wartosc zmienna "botconfig"
            this.config = botconfig;
            this.build(
                this.log("File 'config.js' was loaded successfully.")
            );
        });

        this.CommandLog = new CommandLog(path.join(__dirname, "..", "output.log"));

        this.LoadCommands();
        this.slashCommands = new Collection();

    }

    log(InputText) {
        this.CommandLog.log(InputText);
    }

    warn(InputText) {
        this.CommandLog.warn(InputText);
    }

    error(InputText) {
        this.CommandLog.error(InputText);
    }

    // "build" - wykonywany pod koniec kodu / zawiera logowanie do Clienta Discord
    build() {
        this.log("ShibaBot is starting...");
        this.login(this.config.token);
    }

    LoadCommands() {
        let SlashCommandsDir = path.join(
            __dirname, "..", "commands", "slashCommands"
        );
        
        fs.readdir(SlashCommandsDir, (error, files) => {
            if (error) {
                throw error;
            } else {
                files.forEach((file) => {
                    let command = require(SlashCommandsDir + "/" + file);
                    if (!command || !command.run) {
                        return this.warn("It was unable to load Command starting with: " + file.split(".")[0]);
                    }

                    this.slashCommands.set(file.split(".")[0].toLowerCase(), command);
                    this.log("Slash Command " + "'" + file.split(".")[0] + "'" + "was loaded successfully.");
                });
            }
        });


    }


};

// Exportujemy "ShibaBot", zeby ozywac go w innych Plikach
module.exports = ShibaBot;