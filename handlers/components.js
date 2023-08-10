const { readdirSync } = require("fs");
const { join } = require('path');
const ShibaBot = require("../class/ShibaBot");

/**
 * 
 * @param {ShibaBot} client 
 */
module.exports = (client) => {
    const compontentsDir = join(__dirname, '../components/');

    for (const dir of readdirSync(compontentsDir)) {
        for (const file of readdirSync(compontentsDir + dir).filter((f) => f.endsWith('.js'))) {
            const module = require(compontentsDir + dir + '/' + file);

            if (!module) continue;

            if (dir === 'button') {
                if (!module.customID || !module.run) {
                    client.warn('Unable to load the component ' + file + ' due to missing \'structure#customID\' or/and \'run\' properties!');
                
                    continue;
                };

                client.collection.components.buttons.set(module.customID, module);
            } else if (dir === 'select') {
                if (!module.customID || !module.run) {
                    client.warn('Unable to load the select menu ' + file + ' due to missing \'structure#customID\' or/and \'run\' properties!');

                    continue;
                };

                client.collection.components.selects.set(module.customID, module);
            } else {
                client.log('Invalid component type: ' + file);

                continue;
            };
            client.log('Loaded new component: ' + '../' + dir + ' ' + file);
        }
    }
}