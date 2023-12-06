// commandCategories.js

const ping = require('../commands/admin/ping');
const showdb = require('../commands/admin/showdb');
const stats = require('../commands/admin/stats');
const activestalk = require('../commands/stalking/activestalk');
const stalk = require('../commands/stalking/stalk');
const stalkdm = require('../commands/stalking/stalkdm');
const stopstalking = require('../commands/stalking/stopstalking');

module.exports = {
    CLIENT: {
        name: 'Client',
        emoji: '🛠️',
        commands: [
            // Add other utility commands here
        ],
    },
    ADMIN: {
        name: 'Admin',
        emoji: '⚙️',
        commands: [
            { name: 'ping', command: ping },
            { name: 'stats', command: stats },
            { name: 'showdb', command: showdb },
            // Add other admin commands here
        ],
    },
    STALKINGMANAGER: {
        name: 'Stalking',
        emoji: '👮‍♂️',
        commands: [
            { name: 'activestalk', command: activestalk },
            { name: 'stalk', command: stalk },
            { name: 'stalkdm', command: stalkdm },
            { name: 'stopstalking', command: stopstalking },
            // Add other stalking commands here
        ],
    },
    COMMANDS: {
        ping: '🏓',
        stats: '📊',
        help: '❓',
        activestalk: '👮‍♂️',
        stalk: '👮',
        stalkdm: '👮‍♂️',
        stopstalking: '👮',
    },
};
