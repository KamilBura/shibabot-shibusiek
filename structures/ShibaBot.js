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
const { default: MusicPlayer } = require('../module/MusicPlayer');

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
        .on("trackError", (player, error) => {
            this.error(`${"[MusicPlayer]".cyan} Controller with ID: ${player.options.guild} had an error with Track. Reason: ${error.message}.`);
            // Przypisujemy obecnie odtwarzany utwor do zmiennej "song"
            song = player.queue.current;
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
                    text: "Woof! 🐶 I think something went wrong with the code! Try again, maybe it will work.",
                });
            // Uzywamy kolekcji (Collection) w ktorej wszyskie kanaly, z ktorymi bot jest polaczony sie znajduja.
            client.channels.cache
                // Bierzemy ID kanalu tekstowego
                .get(player.textChannel)
                // Wysylamy Embed "errorEmbed" na ID Kanalu tekstowego
                .send({ embeds: [errorEmbed] });
        })
        // Jezeli player sie zatrzymie z jakiegos powodu to zostaje wyswietlony blad, jak i na konsoli tak i na discordzie
        .on("trackStuck", (player, error) => {
            this.warn(`${"[MusicPlayer]".cyan} Track have been stuck. Reason: ${error.message}`);
            // Przypisujemy obecnie odtwarzany utwor do zmiennej "song"
            song = player.queue.current;
            // Przypisujemy tytul utworu do zmiennej "title" funckja "escapeMarkdown", aby zabezpieczyc tekst przed uzyciem markdown.
            // Zastapiamy wszystkie znaki "[" na pusty ciag.
            // Zastapiamy wszystkie znaki "]" na pusty ciag.
            title = escapeMarkdown(song.title).replace(/\]/g,"").replace(/\[/g,"");

            let errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setTitle("Track had an error!")
                .setDescription(`Bot has failed to load track: \`${title}\``)
                .setFooter({
                    text: "Woof! 🐶 I think something went wrong with the code! Try again, maybe it will work.",
                });
            
            client.channels.cache
                .get(player.textChannel)
                .send({ embeds: [errorEmbed] });
        })
        // Definujemy zdarzenie, ktore ma zostac wywolane, gdy rozpocznie sie odtwarzanie utworu
        .on("trackStart", async (player, track) => {
            // Zmienna "songsQueue" zostaje dodane +1
            this.songsQueue++;
            //Dodajemy "track.identifier" do tablicy "songslist"
            songsList.push(track.identifier);
            // jezeli liczba przekroczy liczbe "500" to pierwszy z listy zostanie usunieta i zastapiony nastepnym
            if (songsList.length >= 500) {
                songsList.shift();
            }
                // Informacja wysylana do konsoli "GuildID" "Nazwa Piosenki"
                this.log(`${"[MusicPlayer]".cyan} with ID: ${player.options.guild} Started Playing a Song [${colors.yellow(track.title)}]`);
            
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
                //.get(player.textChannel)
                //.send({
                    //embeds: [trackStartEmbed],
                    //components: [client.createController(player.options.guild, player),], (Comming Soon, Controller as Button Reaction)
                //})
                //.catch(this.warn(`${colors.blue("[Embeds/-] ")}`) + this.warn)
                //player.setNowPlayingMessage(client, nowPlaying);
        })
        // Tworzymy nasluchiwanie zdarzenia "playerDisconnect" (from voice chat)
        .on("playerDisconnect", async (player) => {
            // Sprawdzamy czy opcja "24/7" jest wlaczona
            if (player.twentyFourSeven) {
                // Tak = Zatrzymuje tylko Playera
                player.stop();
            } else  {
                // Nie = Niszczy Playera i clearuje Lista Odtwarzania
                player.destroy();
                player.queue.clear();
            }
            // Czyscimy Informacje o aktualnie odtwarzanej piosence
            player.setNowPlayingMessage(client, null);
        })
        // Zdarzenie "playerMove" jest wykonywane, gdy gracz(Bot) przenosi sie z jednego kanalu glosowego na inny.
        .on("playerMove", (player, oldChannelState, newChannelState) => {
            // Pobieramy obiekt serwera (guild) na podstawie ID serwera, ktore jest przechowywane w "player.guild"
            const getGuildID = client.guilds.cache.get(player.guild);
            // Jesli obiekt serwera nie zostanie znaleziony, kod jest zakanczany.
            if (!getGuildID) {
                return;
            }
            // Pobieramy obiekt kanalu tekstowego na podstawie ID Kanalu, ktore jest przechowywane w "player.textChannel"
            const getChannelID = guild.channels.cache.get(player.textChannel);
            // Jesli stary i nowy kanal glosowy sa takie same = Zakoncz Kod
            if (oldChannelState === newChannelState) {
                return;
            }
            // Jesli nowy Kanal jest rowny "null" lub nie jest zdefinowany, oznacza to, ze gracz zostaje odlaczony od kanalu glosowego
            if (oldChannelState === null || !newChannelState) {
                // Sprawdzamy czy Gracz jak i kanal teksotwe istnieja
                if (!player) {
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
                                .setDescription(`Woof! 🐶 I got disconnected somehow from <#${oldChannelState}>`),
                        ],
                    });
                }
                // "player" po wyslaniu wiadomosci jest "niszczony", "anulowany"
                return player.destroy();
            // Jesli nowy kanal glosowy jest rozny od null, oznacza to ze gracz zostal przeniesiony do nowego kanalu glosowego
            } else {
                // Ustawiamy nowy "newChannelState" do "player.voiceChannel", a bot jest pauzowany po (Czas do ustawienia w configu)
                player.voiceChannel = newChannelState;
                // Po przeniesieniu na nowy kanal, Muzyka jest pauzowana po czasie (Czas z Configu = MusicPlayerPause)
                setTimeout(() => player.pause(false), this.config.MusicPlayerPause);
                return undefined;
            }
        })
        // Kod Wykonywany jezeli nowy "player" zostanie stworzony na Discordzie
        .on("playerCreate", (player) => {
            // Ustawienia brane z Configa => do playera
            player.set("twentyFourSeven", client.config.twentyFourSeven);
            player.set("autoQueue", client.config.autoQueue);
            player.set("autoStopPlaying", client.config.autoStopPlaying);
            // Informacja wysylana do Command Loga
            this.warn(`${"[MusicPlayer]".cyan}: ${player.options.guild} has been created on Discord with GuildID: 
            ${client.guilds.cache.get(player.options.guild) ? //Sprawdzanie czy client.guilds istnieje. Jezeli nie to "" zostaje puste.
                client.guilds.cache.get(player.options.guild).name : "" }` //Sprawdza czy istnieje "name" of client.guilds. Jezeli nie to jest "undefined"
            );
        })
        // Kod Wykonywany jezeli "MusicPlayer" zostanie zepsuty, bedzie mial jakis problem.
        .on("playerDestroy", (player) =>
            // Informacja wysylana do Command Loga
            this.warn(`${"[MusicPlayer]".cyan}: ${player.options.guild} has been Destoryed on Discord with GuildID: 
                ${client.guilds.cache.get(player.options.guild) ? //Sprawdzanie czy client.guilds istnieje. Jezeli nie to "" zostaje puste.
                client.guilds.cache.get(player.options.guild).name : "" }` //Sprawdza czy istnieje "name" of client.guilds. Jezeli nie to jest "undefined"
            )
        )
        // Kod wykonywany jezeli Player skonczy odtwarzac muzyke
        .on("queueEnd", async (player, track) => {
            // Pobieranie wartosci zmiennych autoQueue i requester z obiektu player
            const autoQueue = player.get("autoQueue");
            const requester = player.get("requester");

            // Sprawdzamy czy autoQueue jest true
            if (autoQueue) {
                // Bierzemy ID odtwarzanej piosenki
                const identifier = track.identifier;
                // Tworzymy adres URL dla wyszukiwania kolejnej sciezki
                const searchPage = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                // Wywolujemy funckje "search" dla playera, aby wyszukac kolejne sciezki
                const result = await player.search(searchPage, requester);
                let nextTrack;

                // Iterujemy(Pentlujemy) przez wyniki wyszukiwania, aby znalesc nastepna sciezke
                result.tracks.some((track, index) => {
                    // Zapisywany jest index nastepnej sciezki
                    nextTrack = index;
                    // Sprawdzamy czy sciezka nie jest juz na liscie odtwarzania
                    return !songsList.includes(track.identifier);
                });

                /**
                 * @type {result.exception} - oznacza, ze wynik dzialania kodu zawiera wyjatek, czyli blad, ktory zostal zgloszony w trakcie jego wykonywania.
                 * 
                 * Jezeli result.exception => true
                 */
                if (result.exception) {
                    // Bierzemy ID Kanalu Discord i wysylamy Embed na te ID
                    client.channels.cache.get(player.textChannel).send({
                        embeds: [
                            // Tworzymy nowy Message Embed
                            new MessageEmbed()
                                .setColor("RED")
                                /**
                                 * @param {exception.severity} - Pole, ktore zawiera informacje o powaznosci wyjatku. Moze ono miec wartosci "ERROR" i "WARNING" //Laut CHAT-GPT, Docs says nothing
                                 */
                                .setAuthor({
                                    name: `${result.exception.severity}`,
                                    iconURL: client.config.iconURL, //Comming Soon
                                })
                                .setDescription( `Woof! 🐶 The Track could not be loaded. \n**Error:** ${result.exception.message}` ),
                        ],
                    });
                    // Niszczymy Playera (Odtwarzacz muzyki)
                    return player.destroy();
                }

                // Odtwarzamy naspteny utwor z tablicy "result.tracks"
                player.play(result.tracks[nextTrack]);
                // Ustawiamy poprzedni utwor na obecnie odtwarzany.
                /**
                 * @param {track} - zmienna zawierajaca informacje o obecnie odtwarzanym utworze
                 */
                player.queue.previous = track;

            } else {
                // Bierzemy ustawienie "twentyFourSeven" z playera i przypisujemy do linijki stalej
                const twentyFourSeven = player.get("twentyFourSeven");

                // Tworzymy nowy Embed z informacja ze "queue" sie zakonczylo
                let queueEmbed = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setAuthor({
                        name: "Woof! 🐶 The Queue has ended.",
                        iconURL: client.config.iconURL,
                    })
                    .setFooter({ text: "Queue has ended" })
                    .setTimestamp();

                // Wysylamy Wiadomosc w tym samym czasie przypisujemy do stalej "EndQueue"
                let EndQueue = await client.channels.cache
                    // Pobieramy Informacje o Kanale (ID)
                    .get(player.textChannel)
                    // Wysylamy Embed "queueEmbed"
                    .send({ embeds: [queueEmbed] });
                // Po 5 Sekundach wiadomosc Embed zostanie usunieta i funkcja "EndQueue.delete" zostanie ustawiona na true
                setTimeout(() => EndQueue.delete(true), client.config.messageRemoveTime);

                try {
                    // Sprawdzamy czy Player nie Gra i czy Opcja twentyFourSeven jest ustawiona na false
                    if (!player.playing && !twentyFourSeven) {
                        setTimeout(async () => {
                            // Jezeli False => Disconnection
                            if(!player.playing && !twentyFourSeven !== "DISCONNECTED") {
                                // Tworzymy nowy Embed, bierzemy Color jak i Informujemy ze Bot Opuscil Voice Chat
                                let DisconnectedEmbed = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setAuthor({
                                        name: "Disconnected!",
                                        iconURL: client.config.iconURL, //Comming Soon
                                    })
                                    .setDescription(`Woof! 🐶 I just leaved the Voice Chat, becouse i felt a little bit alone.`);
                                // Bierzemy ID Kanalu z miejsca Cache
                                let Disconnected = await client.channels.cache
                                    .get(player.textChannel)
                                    // Wysylamy powyzej wyznaczona wiadomosc
                                    .send({ embeds: [DisconnectedEmbed] });
                                // Po wyznaczonym czasie Wiadomosc jest usuwana
                                setTimeout(() => Disconnected.delete(true), client.config.messageRemoveTime);
                                // Niszczymy playera
                                player.destroy();
                                // Jezeli player dalej gra wysylamy informacje o tym
                            } else if (player.playing) {
                                this.warn(`${"[MusicPlayer]".cyan} ID [${player.options.guild}] | is Still Playing!`);
                            }
                            // Czas po ktorym bot opusci kanal Conifg => playerPause
                        }, client.config.playerPause);
                        // Jezeli Player jak i zmienna "twentyFourSeven" = false, Wykonaj
                    } else if (!player.playing && twentyFourSeven) {
                        this.warn(`${"[MusicPlayer]".cyan} ID [${player.options.guild}] | Queue has ended [${colors.red("24/7 ENABLED")}]`);

                    } else {
                        this.warn(`${"[MusicPlayer]".cyan} Woof! 🐶 Something unexpected has happened with the Player! ID: [${player.options.guild}]`);
                    }
                    // Ustawiamy zmeinna setNowPlayingMessage na "null"
                    player.setNowPlayingMessage(client, null);
                } catch (error) {
                    this.error(error);
                }
            }
        });
    }

    // Sprawdzanie czy wiadomosc zostala usunieta w trakcie dzialania bota
    CheckMessageDeleted(message) {
        return this.deletedMessages.has(message);
    }

    // Funkcja dodaje wiadomosc do "WeakSet", ktory przechowuje usuniete wiadomosci.
    // Stan usunietych wiadomosci mozna zobaczyc w kodzie i wykorzystac potem.
    // Wiadomosc jest przekazywana jako argument do funkcji, a nastepnie dodawana do "WeakSet" za pomoca "add()"
    markMessageAsDeleted(message) {
        this.deletedMessages.add(message);
    }

    /**
     * @param {string} text
     * @param {boolean} isError
     * @returns {MessageEmbed}
     */
    // do funkcji Embed przypisujemy 2 argumenty "text" i "isError" z wartoscia domyslna = false, ktory okresla, czy tworzony embed ma byc czerwony czy brany z Configu
    Embed(text, isError = false) {
        let embed = new MessageEmbed()
            .setColor(isError ? "RED" : this.config.embedColor)

        if (text) {
            embed.setDescription((isError ? "❌ | " : "") + text);
        }

        return embed;
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