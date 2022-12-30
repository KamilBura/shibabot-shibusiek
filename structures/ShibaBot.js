/**
 * Importujemy potrzebne klasy z biblioteki "discord.js"
 * `client` - uzywana do obslugi wydarzen, komunikacji z serwerami disocrd, itp.
 * W pliku **index.js** obiekt klienta zostaje utworzony za pomca struktury "ShibaBot"
 * Obiekt klienta jest uzywany w innych plikach aplikacji po jego zaimportowaniu i eksporcie za pomoca `module.exports`
 */
const { Client, Intents } = require('discord.js');
const ImportConfig = require('../utility/ImportConfig');

class ShibaBot extends Client {

    constructor(
        props = {
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_MESSAGES,
            ],
        }
    ) {
        super(props);

        ImportConfig().then((botconfig) => {
            this.config = botconfig;
            this.build();
        });
    }

    build() {
        this.login(this.config.token);
    } 
}

module.exports = ShibaBot;