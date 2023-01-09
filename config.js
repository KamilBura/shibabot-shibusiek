module.exports = {
    /**
     * `process.env` to obiekt globalny w Node.js, ktory zawiera informacje o srodowisku uruchomieniowym procesu.
     * Srodowisko uruchomieniowe to zestaw zmiennych srodowiskowych, ktore sa dostepne dla procesu i moga byc uzywane
     * do konfiguracji lub dostosowania aplikacji.
     */
    // "token" - Bota Discord
    // "clientId" - clientID Bota Discord
    // "clientSecret" - Bota Discord
    // "consolePreifx" - Console Prefix pokazywany po Datcie i Godzinie, domyslny Kolor to Zolty / Pomaranczowy
    consolePrefix: "🐕 ShibaBot:",
    
    // Ustawienia LavaLinka
    // Po dolaczeniu uzytkownika na kanal glosowy Automatycznie wznawia queue
    autoPlay: true, // true or false
    nodes: [{
        host: "ssl.freelavalink.ga",
        port: 443,
        password: "www.freelavalink.ga",
        secure: true, // true or false
    },
],
    // Discord Bot Presence - It's the same to RichPresence
    presence: {
        // Status schown on the Bot / online, idle or dnd
        status: "idle",
        activities: [
        {
            // What is shown in RichPresence
            name: "🐕 Shiba Testing", // Status Text
            type: "LISTENING", // What the bot is doing, PLAYING, WATCHING, LISTENING, STREAMING
        },
    ],
},

};
