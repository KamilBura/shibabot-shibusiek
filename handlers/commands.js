const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = (client) => {
    const commandsPath = join(__dirname, '../commands');


    for (const type of readdirSync(commandsPath)) {
        for (const dir of readdirSync(commandsPath + '/' + type)) {
            for (const file of readdirSync(commandsPath + '/' + type + '/' + dir).filter((f) => f.endsWith('.js'))) {
                const module = require(commandsPath + '/' + type + '/' + dir + '/' + file);

                if (!module) continue;

                if (type === 'prefix') {
                    if (!module.structure?.name || !module.run) {
                        client.warn('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.');
        
                        continue;
                    };

                    client.collection.prefixcommands.set(module.structure.name, module);

                    if (module.structure.aliases && Array.isArray(module.structure.aliases)) {
                        module.structure.aliases.forEach((alias) => {
                            client.collection.aliases.set(alias, module.structure.name);
                        });
                    };
                } else {
                    if (!module.structure?.name || !module.run) {
                        client.warn('Unable to load the command ' + file +' due to missing \'structure#name\' or/and \'run\' properties.');
        
                        continue;
                    };

                    client.collection.interactioncommands.set(module.structure.name, module);
                    client.applicationcommandsArray.push(module.structure);
                };

                client.log('Loaded new command: ' + file);
            };
        };
    };
};