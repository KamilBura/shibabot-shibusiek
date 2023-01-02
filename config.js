module.exports = {
    /**
     * `process.env` to obiekt globalny w Node.js, ktory zawiera informacje o srodowisku uruchomieniowym procesu.
     * Srodowisko uruchomieniowe to zestaw zmiennych srodowiskowych, ktore sa dostepne dla procesu i moga byc uzywane
     * do konfiguracji lub dostosowania aplikacji.
     */
    // "token" - Bota Discord
    token: process.env.token || "MTA1NjYxNDc0MzcwMTQ1NDkxOQ.G3WXFI.K0lFq88CsVIpw5NmRCbs-PQsPcjqF0QIaDahkI",
    // "clientId" - clientID Bota Discord
    clientId: process.env.clientId || "1056614743701454919",
    // "clientSecret" - Bota Discord
    clientSecret: process.env.clientSecret || "i2rZcQcaUeAt7MZllTJXIf8IjcsLoLx0",
    // "consolePreifx" - Console Prefix pokazywany po Datcie i Godzinie, domyslny Kolor to Zolty / Pomaranczowy
    consolePrefix: "🐕 ShibaBot:",
}
