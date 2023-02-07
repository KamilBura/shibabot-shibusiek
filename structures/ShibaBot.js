/**
 * 
 * Importujemy potrzebne klasy z biblioteki "discord.js"
 * `client` - uzywana do obslugi wydarzen, komunikacji z serwerami disocrd, itp.
 * W pliku **index.js** obiekt klienta zostaje utworzony za pomca struktury "ShibaBot"
 * Obiekt klienta jest uzywany w innych plikach aplikacji po jego zaimportowaniu i eksporcie za pomoca `module.exports`
 * 
 */

// Bilbioteki / Discord.js Module
const {
    Client, 
    Collection, 
    escapeMarkdown, 
    IntentsBitField,
    MessageEmbed,
} = require('discord.js');

const { SlashCommandBuilder } = require('@discordjs/builders');

// NodeJS / NPM Module
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const pMS = require('pretty-ms');

// Lavalink / Music
const { Manager } = require('erela.js');
const Spotify = require('better-erela.js-spotify').default;
const AppleMusic = require('better-erela.js-apple').default;
const Facebook = require('erela.js-facebook');
const Filters = require('erela.js-filters');
let song, title;

// Biblioteki / JS
const ImportConfig = require('../utility/ImportConfig');
const CommandLog = require('../module/CommandLog');
const LavalinkConnection = require('../module/getConLavalink');

// Nowa klasa o nazwie "ShibaBot", ktory rozszerza klase 'Client' z biblioteki discord.js
class ShibaBot extends Client {
    // tworzymy "consturctor", constructor sluzy do iniclt: AppleMusic j = requializacji nowo utworzonego obiektu poprzez ustawienie poczatkowych wartosci wlasciwosci
    constructor(
        // Ladujemy wszystkie Intents do jednej zmiennej "IntentsLoad" / Intents.FLAGS.GUILDS => Nie dziala - GatewayIntentsBit.Guilds instead.
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
        
        this.LavalinkConnection = LavalinkConnection;
        this.commandsRan = 0;
        this.songsQueue = 0;
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
        let songsList = [];

        // Tworzymy nowy obiekt "Manager" z biblioteki "erela.js"
        this.manager = new Manager({
            // Tabela zmienna z wtyczkami do managera muzyki
            plugins: [
                // https://www.npmjs.com/package/better-erela.js-spotify
                new Spotify(),
                // https://www.npmjs.com/package/better-erela.js-apple
                new AppleMusic(),
                // https://www.npmjs.com/package/erela.js-facebook
                new Facebook(),
                // https://www.npmjs.com/package/erela.js-filters
                new Filters(),
            ],
            autoPlay: this.config.autoPlay,
            nodes: this.config.nodes,
            // Nowa Funkcja "send", sluzy do wysylania danych do serwera Lavalink
            /**
             * id      - Indetyfikator Discorda
             * payload - Dane ktore sa wysylane przez menegera do serwera Lavalink, np. informacje o utworze ktory ma zostac oddtworzony
             */
            send: (id, payload) => {
                const guild = client.guilds.cache.get(id);
                if (guild) {
                    guild.shard.send(payload);
                }
            },
        })
        // Jezeli "Node" zostanie polaczony dostaniem o tym informacje
        .on("nodeConnect", (node) =>
            this.log(`${"[Lavalink]".cyan} Connected to node with ID: ${node.options.host}`)
        )
        // Jezeli "Node" zostanie rozlaczony i probuje sie na nowa polaczyc z "Node"
        .on("nodeReconnect", () =>
            this.warn(`${"[Lavalink]".cyan} Reconnecting to node...`)
        )
        // Jezeli Polaczenie zostanie przerwane to dostaniemy o tym informacje
        .on("nodeDestroy", () =>
            this.warn(`${"[Lavalink]".cyan} The Connection from Node has been broken ;_;`)
        )
        // Jezeli "Node" sie rozlaczy => Informacja
        .on("nodeDisconnect", () =>
            this.warn(`${"[Lavalink]".cyan} Disconnected from node ಥ_ಥ`)
        )
        // Jezeli "Node" dostanie blad => Informacja
        .on("nodeError", (error) => 
            this.error(`${"[Lavalink]".cyan} Lavalink got an error: ${error.message}.`)
        )
        // Kiedy event zostaje przerwany, Blad jest wysylany do Konsoli
        .on("loadFailed", (type, error) =>
            this.error(`${"[MusicPlayer]".cyan} Failed to Load ${type}: ${error.message}.`)
        )
        // Jezeli bedzie jakis problem z Utworem, zostanie wyslana wiadomosc w konsoli, jak i tez na Discordzie, uzywajac "MessageEmbed".
        .on("trackError", (MusicPlayer, error) => {
            this.error(`${"[MusicPlayer]".cyan} Controller with ID: ${MusicPlayer.options.guild} had an error with Track. Reason: ${error.message}.`);
            // Przypisujemy obecnie odtwarzany utwor do zmiennej "song"
            song = MusicPlayer.queue.current;
            // Przypisujemy tytul utworu do zmiennej "title" funckja "escapeMarkdown", aby zabezpieczyc tekst przed uzyciem markdown.
            // Zastapiamy wszystkie znaki "[" na pusty ciag.
            // Zastapiamy wszystkie znaki "]" na pusty ciag.
            title = escapeMarkdown(song.title).replace(/\]/g,"").replace(/\[/g,"");

            // Robimy zmienna "errorEmbed", w ktorej znajuda sie wszystkie informacje potrzebne dla Discorda. np. Color, Tytul, etc.
            let errorEmbed = new MessageEmbed()
                // Color Embedu
                .setColor('RED')
                // Tytul Embedu - na samej gorze
                .setTitle('Playback had an error!')
                // Wiadomosc w srodku Embedu
                .setDescription(`Bot has failed to load a track: \`${title}\``)
                // Wiadomosc na samym dole Embedu
                .setFooter({
                    text: "Woof! I think something went wrong with the code! Try again, maybe it will work.",
                });
            // Uzywamy kolekcji (Collection) w ktorej wszyskie kanaly, z ktorymi bot jest polaczony sie znajduja.
            client.channels.cache
                // Bierzemy ID kanalu tekstowego
                .get(MusicPlayer.textChannel)
                // Wysylamy Embed "errorEmbed" na ID Kanalu tekstowego
                .send({ embeds: [errorEmbed] });
        })
        // Jezeli MusicPlayer sie zatrzymie z jakiegos powodu to zostaje wyswietlony blad, jak i na konsoli tak i na discordzie
        .on("trackStuck", (MusicPlayer, error) => {
            this.warn(`${"[MusicPlayer]".cyan} Track have been stuck. Reason: ${error.message}`);
            // Przypisujemy obecnie odtwarzany utwor do zmiennej "song"
            song = MusicPlayer.queue.current;
            // Przypisujemy tytul utworu do zmiennej "title" funckja "escapeMarkdown", aby zabezpieczyc tekst przed uzyciem markdown.
            // Zastapiamy wszystkie znaki "[" na pusty ciag.
            // Zastapiamy wszystkie znaki "]" na pusty ciag.
            title = escapeMarkdown(song.title).replace(/\]/g,"").replace(/\[/g,"");

            let errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("Track had an error!")
                .setDescription(`Bot has failed to load track: \`${title}\``)
                .setFooter({
                    text: "Woof! I think something went wrong with the code! Try again, maybe it will work.",
                });
            
            client.channels.cache
                .get(MusicPlayer.textChannel)
                .send({ embeds: [errorEmbed] });
        })
        // Definujemy zdarzenie, ktore ma zostac wywolane, gdy rozpocznie sie odtwarzanie utworu
        .on("trackStart", async (MusicPlayer, track) => {
            // Zmienna "songsQueue" zostaje dodane +1
            this.songsQueue++;
            //Dodajemy "track.identifier" do tablicy "songslist"
            songsList.push(track.identifier);
            // jezeli liczba przekroczy liczbe "500" to pierwszy z listy zostanie usunieta i zastapiony nastepnym
            if (songsList.length >= 500) {
                songsList.shift();
            }
                // Informacja wysylana do konsoli "GuildID" "Nazwa Piosenki"
                this.log(`${"[MusicPlayer]".cyan} with ID: ${MusicPlayer.options.guild} Started Playing a Song [${colors.yellow(track.title)}]`);
            
            // Przypisujemy tytul utworu do zmiennej "title" funckja "escapeMarkdown", aby zabezpieczyc tekst przed uzyciem markdown.
            // Zastapiamy wszystkie znaki "[" na pusty ciag.
            // Zastapiamy wszystkie znaki "]" na pusty ciag.
            title = escapeMarkdown(song.title).replace(/\]/g,"").replace(/\[/g,"");

            // Embed Wysylany po tym jak zostanie wykryta aktywnosc o nowej piosence, przyklad /play
            let trackStartEmbed = this.Embed()
                // Author na samej Gorze wiadomosci Embed
                .setAuthor({ name: "Now Woofing", icon: "COMMING SOON"})
                // Pod Author, Informacje o Nazwie Piosenki i link, Jezeli nie zostanie znaleziony tytul, lub bedzie jakis problem to bedzie undefined
                .setDescription(`[${title}]${title.uri}` || undefined )
                // Dodajemy 2 Nowe Fieldy, jeden z Informacjami kto Zarequestowal, a drugi z Artysta Utworu/Kanalem Youtube
                .addFields(
                    {
                        name: "Requested by",
                        value: `${track.requester}`,
                        inline: true,
                    },
                    {
                        name: "Artist",
                        value: `${track.author}`,
                        inline: true,
                    }
                )
                // Dodajemy ostatni Field z Dlugoscia Tytulu
                .addFields({
                    name: "Duration",
                    value: track.isStream ? `\`LIVE \`` : track.duration > 10 * 60 * 60 * 1000 // Dluzej niz 10H => nie pokazuje 
                    ? "Stream is longer than 10 Hours..."
                    : `\`${pMS(track.duration, {colonNotation: true, })}\``, // colonNotation: true => 01:30:00 ... 
                    inline: true,      
                });
            // Probujemy Dostac Thumnnail (Wiadomosc Prawy Gorny Rog)
            try {
                // Embed + .setThumbnail (Ustawiamy Thumbnail)
                trackStartEmbed.setThumbnail(
                    // Funkcja track z biblioteki erela.js
                    /**
                     * Value: "0" | "1" | "2" | "3" | "default" | "mqdefault" | "hqdefault" | "maxresdefault"
                     */
                    track.displayThumbnail("maxresdefault")
                );
            // Jezeli Thumbnail sie nie zaladuje, jest on ladowany jako URL
            } catch(error) {
                trackStartEmbed.setThumbnail(track.thumbnail);
                this.warn(`${colors.blue("[Embed/-]")} Thumbnail failed to load (Loaded as URL) ${error}`);
            }

            //let NowPlaying = await client.channels.cache
                //.get(MusicPlayer.textChannel)
                //.send({
                    //embeds: [trackStartEmbed],
                    //components: [client.createController(MusicPlayer.options.guild, MusicPlayer),], (Comming Soon, Controller as Button Reaction)
                //})
                //.catch(this.warn(`${colors.blue("[Embeds/-] ")}`) + this.warn)
                //MusicPlayer.setNowPlayingMessage(client, nowPlaying);
        })
        // Zdarzenie "playerMove" jest wykonywane, gdy gracz(Bot) przenosi sie z jednego kanalu glosowego na inny.
        .on("playerMove", (MusicPlayer, oldChannelState, newChannelState) => {
            // Pobieramy obiekt serwera (guild) na podstawie ID serwera, ktore jest przechowywane w "MusicPlayer.guild"
            const getGuildID = client.guilds.cache.get(MusicPlayer.guild);
            // Jesli obiekt serwera nie zostanie znaleziony, kod jest zakanczany.
            if (!getGuildID) {
                return;
            }
            // Pobieramy obiekt kanalu tekstowego na podstawie ID Kanalu, ktore jest przechowywane w "MusicPlayer.textChannel"
            const getChannelID = guild.channels.cache.get(MusicPlayer.textChannel);
            // Jesli stary i nowy kanal glosowy sa takie same = Zakoncz Kod
            if (oldChannelState === newChannelState) {
                return;
            }
            // Jesli nowy Kanal jest rowny "null" lub nie jest zdefinowany, oznacza to, ze gracz zostaje odlaczony od kanalu glosowego
            if (oldChannelState === null || !newChannelState) {
                // Sprawdzamy czy Gracz jak i kanal teksotwe istnieja
                if (!MusicPlayer) {
                    return;
                }
                // Jesli "tak", to wysylamy wiadomosc na kanal tesktowy z informacja o odlaczeniu od kanalu glosowego
                if (getChannelID) {
                    // Wysylamy informacje o bledzie na kanal tesktowy
                    channel.send({
                        embeds: [
                            // Tworzymy nowy "MessageEmbed"
                            new MessageEmbed()
                                .setColor("RED")
                                .setTitle("Voice Chat Error!")
                                .setDescription(`Woof! I got disconnected somehow from <#${oldChannelState}>`),
                        ],
                    });
                }
                // "MusicPlayer" po wyslaniu wiadomosci jest "niszczony", "anulowany"
                return MusicPlayer.destroy();
            // Jesli nowy kanal glosowy jest rozny od null, oznacza to ze gracz zostal przeniesiony do nowego kanalu glosowego
            } else {
                // Ustawiamy nowy "newChannelState" do "MusicPlayer.voiceChannel", a bot jest pauzowany po (Czas do ustawienia w configu)
                MusicPlayer.voiceChannel = newChannelState;
                // Po przeniesieniu na nowy kanal, Muzyka jest pauzowana po czasie (Czas z Configu = MusicPlayerPause)
                setTimeout(() => MusicPlayer.pause(false), this.config.MusicPlayerPause);
                return undefined;
            }
        })
        // Kod Wykonywany jezeli nowy "MusicPlayer" zostanie stworzony na Discordzie
        .on("playerCreate", (MusicPlayer) => {
            // Ustawienia brane z Configa => do MusicPlayera
            MusicPlayer.set("twentyFourSeven", client.config.twentyFourSeven);
            MusicPlayer.set("autoQueue", client.config.autoQueue);
            MusicPlayer.set("autoStopPlaying", client.config.autoStopPlaying);
            // Informacja wysylana do Command Loga
            this.warn(`${"[MusicPlayer]".cyan}: ${MusicPlayer.options.guild} has been created on Discord with GuildID: 
            ${client.guilds.cache.get(MusicPlayer.options.guild) ? //Sprawdzanie czy client.guilds istnieje. Jezeli nie to "" zostaje puste.
                client.guilds.cache.get(MusicPlayer.options.guild).name : "" }` //Sprawdza czy istnieje "name" of client.guilds. Jezeli nie to jest "undefined"
            );
        })
        // Kod Wykonywany jezeli "MusicPlayer" zostanie zepsuty, bedzie mial jakis problem.
        .on("playerDestroy", (MusicPlayer) =>
            // Informacja wysylana do Command Loga
            this.warn(`${"[MusicPlayer]".cyan}: ${MusicPlayer.options.guild} has been Destoryed on Discord with GuildID: 
                ${client.guilds.cache.get(MusicPlayer.options.guild) ? //Sprawdzanie czy client.guilds istnieje. Jezeli nie to "" zostaje puste.
                client.guilds.cache.get(MusicPlayer.options.guild).name : "" }` //Sprawdza czy istnieje "name" of client.guilds. Jezeli nie to jest "undefined"
            )
        )


            






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
                    // Wyswietla informacje w consoli ze ko,emda zostala pomyslnie zainicjowana
                    this.log("Event script" + " '" + file.split(".")[0] + "' " + "was loaded successfully.");
                });
            }
        });
    }
    
    // "LoadCommands" - wykonywany kod pod tym znaczeniem ktory jest trigerowany this.xxx();
    LoadCommands() {
        // "path.join" - Laczenie sciezki w jedna, kierowana sciezka to ../commands/slashCommands/
        let SlashCommandsDir = path.join(
            __dirname, "..", "commands", "slash"
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
                    this.log("Slash Command" + " '" + file.split(".")[0] + "' " + "was loaded successfully.");
                });
            }
        });
    
    
    }



}

// Tworzymy nowa Klase "LoadCommandsSettings" ktora rozszerza klase "SlashCommandBuilder"
class LoadCommandsSettings extends SlashCommandBuilder {
    constructor() {
        super();
        // Ustawiamy wartosc "type" na 1, a nastepnie zwracamy obiekt
        this.type = 1; // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
        return this;
    }
    // Robimy metode "setRun", ktora ustawia wlasciwosc "run" na funkcje przekazana jako argument
    setRun(callback) {
        this.run = callback;
        // Po wywolaniu metody "setRun", metoda ta zwraca obiekt.
        return this;
    }
}

// Exportujemy "ShibaBot", zeby ozywac go w innych Plikach
module.exports = { ShibaBot, LoadCommandsSettings };