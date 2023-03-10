const colors = require("colors");
// Importujemy Modul do clienta "ShibaBot" i inicjalizujemy go
module.exports = (client) => {
    // wywolujemy metode "init" z obiektu "manager" w obiekcie "client"
    client.manager.init(client.user.id);
    // Ustawiamy obecnosc bota (Ustawiamy jego status ktory znajduje sie w "config.js")
    client.user.setPresence({
        activities: [{
            name: client.config.presence.activities[0].name,
            type: client.config.presence.activities[0].type
        }],
        status: client.config.presence.status
    });
    // Jezeli bot zostanie pomyslnie zainicjowany dostajemy informacje ze bot zostal zalogowany pomyslnie
    client.log("Bot successfully logged as " + client.user.tag);
    client.log(`Activity: ${colors.yellow(client.config.presence.activities[0].name)} Type: ${colors.yellow(client.config.presence.activities[0].type)} Status: ${colors.yellow(client.config.presence.status)}`);
};