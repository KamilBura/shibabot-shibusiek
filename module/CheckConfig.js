const config = require("../config/config");
const permissions = require("./permissions");
const client = require("../class/ShibaBot");
const Logger = require("../module/CommandLog");

module.exports = class Checker {
    static CheckConfig() {
        Logger.verifer("Checking config file...")

        //Bot Token
        if (!process.env.token && !config.token) {
            Logger.verifer("BOT TOKEN cannot be empty!");
            process.exit(1);
        }

        //clientID
        if (!process.env.cliendID && !config.clientID) {
            Logger.verifer("CLIENT ID cannot be empty!");
            process.exit(1);
        }

        //clientSecret
        if (!process.env.clientSecret && !config.clientSecret) {
            Logger.verifer("CLIENTSECRET cannot be empty!");
            process.exit(1);
        }

        //Mongoose Database config
        if (!config.mongodb.uri && !config.mongodb.toggle) {
            Logger.verifer("Mongo URI cannot be empty when toggle is set to false");
            process.exit(1);
        }

        if (config.adminIds.length === 0) Logger.verifer("Found no Admin Id's in config (you can just ignore it)")

        if (!config.consolePrefix) Logger.verifer("consolePrefix hasn't been set!");

        if (!config.presence.activities) Logger.verifer("Discord Presence hasn't been set!");
    }
}