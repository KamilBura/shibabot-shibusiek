const config = require('../../config/config')

module.exports = {
    event: 'ready',
    once: true,
    run: (client) => {
        client.log('Logged in as: ' + client.user.tag);
    }
};