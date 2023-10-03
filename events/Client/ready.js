const config = require('../../config/config')
const Logger = require("../../module/CommandLog")

module.exports = {
    event: 'ready',
    once: true,
    run: (client) => {
        Logger.log('Logged in as: ' + client.user.tag);
    }
};