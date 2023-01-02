/**
 * 
 * Importujemy potrzebne klasy z biblioteki "discord.js"
 * `client` - uzywana do obslugi wydarzen, komunikacji z serwerami disocrd, itp.
 * W pliku **index.js** obiekt klienta zostaje utworzony za pomca struktury "ShibaBot"
 * Obiekt klienta jest uzywany w innych plikach aplikacji po jego zaimportowaniu i eksporcie za pomoca `module.exports`
 * 
 */

// Bilbioteki / Module
const { Client, IntentsBitField, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

// Biblioteki
const ImportConfig = require('../utility/ImportConfig');
const CommandLog = require('../library/CommandLog');

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

        // Wywolujemy Funkcje "LoadCommands" L=65
        this.LoadCommands();

        /**
         * 
         * Tworzymy nowa kolekcje o nazwie "slashCommands"
         * Collection jest rodzajem danych sluzacym do przechowywania i zarzadzania tablicami. Collection z discord.js rozni sie tym, ze
         * Collection mozliwia dodawanie wartosci do tablicy poprzez uzycie kluczy, a takze udostepnia dodatkowe metody jak .find() czy .filter()
         * 
         */
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

    // "LoadCommands" - wykonywany kod pod tym znaczeniem ktory jest trigerowany this.xxx();
    LoadCommands() {
        // "path.join" - Laczenie sciezki w jedna, kierowana sciezka to ../commands/slashCommands/
        let SlashCommandsDir = path.join(
            __dirname, "..", "commands", "slashCommands"
        );
        
        // Odczytujemy zawartosc folderu ktory znajduje sie u gory okreslonej zmiennej "SlashCommandsDir"
        // Przypisujemy 2 zmienne (error i files)
        fs.readdir(SlashCommandsDir, (error, files) => {
            // Jezeli wystapi blad to zostanie wybrana ta sciezka
            if (error) {
                // Zostanie pokazany blad
                throw error;
            } else if (files.length === 0) {
                this.warn("slashCommands folder seems to be empty!")
            } else {
                // Jezeli nie bedzie problemu wybierana jest 2 sciezka
                // .forEach - przechodzi przez kazdy Plik ktory sie znajduje w SlashCommandsDir
                files.forEach((file) => {
                    // Kazdy plik jest wczytywany za pomoca funkcji "require"
                    let command = require(SlashCommandsDir + "/" + file);
                    // Plik jest sprawdzany czy znajduje sie w pliku odpowiedna zmienna "run"
                    if (!command || !command.run) {
                        // Jezeli odpowiednia zmienna nie jest ustalony wczytuje blad
                        return this.warn("It was unable to load Command starting with: " + file.split(".")[0]);
                    }

                    // Jezeli jest okreslona funkcja to wczytuje kolekcje za pomoca "this.slashCommands" uzywajac metody "set"
                    this.slashCommands.set(file.split(".")[0].toLowerCase(), command);
                    // Wyswietla informacje w consoli ze komenda zostala pomyslnie zainicjowana
                    this.log("Slash Command " + "'" + file.split(".")[0] + "'" + "was loaded successfully.");
                });
            }
        });


    }


};

// Exportujemy "ShibaBot", zeby ozywac go w innych Plikach
module.exports = ShibaBot;