/**
 * 
 * Importujemy potrzebne klasy z biblioteki "discord.js"
 * `client` - uzywana do obslugi wydarzen, komunikacji z serwerami disocrd, itp.
 * W pliku **index.js** obiekt klienta zostaje utworzony za pomca struktury "ShibaBot"
 * Obiekt klienta jest uzywany w innych plikach aplikacji po jego zaimportowaniu i eksporcie za pomoca `module.exports`
 * 
 */

// Bilbioteki / Module
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { Manager } = require('erela.js');
const Spotify = require('better-erela.js-spotify').default;
const { default: AppleMusic } = require('better-erela.js-apple');
const filters = require('erela.js-filters');

// Biblioteki
const ImportConfig = require('../utility/ImportConfig');
const CommandLog = require('../library/CommandLog');

// Nowa klasa o nazwie "ShibaBot", ktory rozszerza klase 'Client' z biblioteki discord.js
class ShibaBot extends Client {
    // tworzymy "consturctor", constructor sluzy do iniclt: AppleMusic j = requializacji nowo utworzonego obiektu poprzez ustawienie poczatkowych wartosci wlasciwosci
    constructor(
        // Ladujemy wszystkie Intents do jednej zmiennej "IntentsLoad" / Intents.FLAGS.GUILDS => Nie dziala - IntentsBitField.Flags.Guilds instead.
        IntentsLoad = {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
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
        /**
         * 
         * Tworzymy nowa kolekcje o nazwie "slashCommands"
         * Collection jest rodzajem danych sluzacym do przechowywania i zarzadzania tablicami. Collection z discord.js rozni sie tym, ze
         * Collection mozliwia dodawanie wartosci do tablicy poprzez uzycie kluczy, a takze udostepnia dodatkowe metody jak .find() czy .filter()
         * 
         */
        this.slashCommands = new Collection();

        this.CommandLog = new CommandLog(path.join(__dirname, "..", "output.log"));
        
        // Wywolujemy Funkcje "LoadCommands"
        this.LoadCommands();
        // Wywolujemy Funkcje "LoadEvents"
        this.LoadEvents(); 
        
        this.commandsRange = 0;
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
        

        let client = this;
        // LAVALINK CONNECTION
        this.manager = new Manager({
            plugins: [
                new AppleMusic(),
                new Spotify(),
                new filters(),
            ],
            autoPlay: this.config.autoPlay,
            nodes: this.config.nodes,
            
            // Kod sluzy do wysylania danych pomiedzy Discordem a Lavalinkiem!
            // Wywolujemy funkcje anonimowa przypisana do wlasciwosci "send" obiektu "Manager"
            // id - identyfikator serwera Discord
            // payload - dane, ktore maja zostac wyslane
            send: (id, payload) => {
                // do zmiennej "serverCheck" przypisujemy indetyfikator serwera Discord podanym jako id
                // "id" pobieramy z kolekcji "guilds" obiektu "client", za pomoca metody "get"
                let guild = client.guilds.cache.get(id);
                // Jesli serwer o podanym id istnieje
                if (guild) {
                    // payload jest wysylany do serwera za pomoca metody "send" obiektu "shard"
                    guild.shard.send(payload);
                }
            },
        })
            .on("nodeConnect", (node) =>
            this.log(`Node with ID ${node.options.host} was connected successfully.`)
            )

            .on("nodeDisconnect", (node) =>
            this.log(`Node with ID ${node.options.host} was disconnected.`)
            )

            .on("nodeError", (node, error) => {
                this.warn(`Node with ID ${node.options.host} had an error: ${error.message}.`);
            })

    }

    // "LoadEvents" - wykonywany kod pod tym znaczeniem ktory jest trigerowany powyzej
    LoadEvents() {
        // Przydzielamy sciezke do jednej zmiennej "EventsDir" za pomoca path.join
        let EventsDir = path.join(__dirname, "..", "events");
        // Odczytujemy zawartosc folderu ktorego sciezka zostaje okreslona powyzej
        fs.readdir(EventsDir, (error, files) => {
            // Wykonywane jezeli wystapi blad podczas inicjonowania kodu 
            if (error) {
                throw error;
              // Opcja jest wykonywana jezeli nie ma bledu ale folder jest pusty
            } else if (files.length === 0) {
                this.warn("events folder seems to be empty!")
              // Jezeli folder nie jest pusty, i nie ma bledu. Wybierana jest ta opcja
            } else {
                // .forEach - Przechodzi przez kazdy Plik znajdujacy sie w sciezce "EventsDir"
                files.forEach((file) => {
                    // Kazdy plik jest wczytywany za pomoca funkcji "require"
                    const event = require(EventsDir + "/" + file);
                    /**
                     * Rejestrujemy zdarzenie za pomoca metody "on", podajac jako argumenty, nazwe, zdarzenia oraz funkcje.
                     * 
                     * Funkcja event.bind(null, this) tworzy nowa funkcje z ta sama trescia co event, ale z pierwszym argumentem ustawionym na null...
                     * i drugim argumentem ustawionym na this. W ten sposob, gdy zdarzenie jest emitowane, ta nowa funckaj bedzie wywolywana...
                     * z this ustawionym na obecny obiekt (w tym przypadku, obiekt klienta Discorda).
                     */
                    this.on(file.split(".")[0], event.bind(null, this));
                    // Wyswietla informacje w consoli ze komenda zostala pomyslnie zainicjowana
                    this.log("Event script" + " '" + file.split(".")[0] + "' " + "was loaded successfully.");
                });
            }
        });
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
              // Opcja jest wykonywana jezeli nie ma bledu ale folder jest pusty
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