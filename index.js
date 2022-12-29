// Impurtujemy strukture ShibaBot z pliku *structures* i przypisujemy Klase ShibaBot do niej
const ShibaBot = require("./structures/ShibaBot");

// Tworzymy nowy obiekt za pomoca Konstruktora `new`, klienta za pomoca struktury ShibaBot / (client) - jest importowany z pliku ShibaBot z bilbioteki discord.js
const client = new ShibaBot();

// Eksportujemy obiekt klienta jako Modul 
module.exports = {
    client,
};

/**
 * `module.exports` - dzieki niemu mozemy eksportowac elementy z pliku do modulu, a potem odczytywac je przez inne pliki.
 * Funkcja ta sluzy do eksportowania elementow takich jak "funkcje, zmienne, obiekty, itp."
 * 
 */

