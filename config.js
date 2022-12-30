module.exports = {
    /**
     * `process.env` to obiekt globalny w Node.js, ktory zawiera informacje o srodowisku uruchomieniowym procesu.
     * Srodowisko uruchomieniowe to zestaw zmiennych srodowiskowych, ktore sa dostepne dla procesu i moga byc uzywane
     * do konfiguracji lub dostosowania aplikacji.
     */
    // "token" - Bota Discord
    token: process.env.token || "token",
    // "clientId" - clientID Bota Discord
    clientId: process.env.clientId || "clientid",
    // "clientSecret" - Bota Discord
    clientSecret: process.env.clientSecret || "clientsecret",
}
