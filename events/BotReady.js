// WILL START WORK WHEN THE LAVALINK / ERELA.JS IS CONNECTED!

// Importujemy Modul do clienta "ShibaBot" i inicjalizujemy go
module.exports = (client) => {
    // wywolujemy metode "init" z obiektu "manager" w obiekcie "client"
    client.manager.init(client.user.id);
    // Ustawiamy obecnosc bota (Ustawiamy jego status ktory znajduje sie w "config.js")
    client.user.setPresence(client.config.presence);
    // Jezeli bot zostanie pomyslnie zainicjowany dostajemy informacje ze bot zostal zalogowany pomyslnie
    client.log("Bot successfully logged as " + client.user.tag);
};