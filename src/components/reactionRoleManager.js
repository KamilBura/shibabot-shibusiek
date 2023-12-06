const dbManager = require('../database/dbManager');

const addReactionRole = (client, guildId, messageId, roleId, emoji, unreact) => {
    if (!client) {
        console.error('Client is undefined. Cannot fetch channels.');
        return;
    }

    const reactionRoles = dbManager.getServerInfo(guildId).reactionRoles || [];
    const newReactionRole = {
        messageId,
        roleId,
        emoji,
        unreact,
    };

    reactionRoles.push(newReactionRole);

    dbManager.updateServerInfo(guildId, { reactionRoles });

    client.channels.fetch(messageId, { partial: ['MESSAGE'] })
        .then(channel => {
            // Fetch the message and react with the specified emoji
            channel.messages.fetch(messageId, { partial: ['REACTION', 'USER', 'MESSAGE'] })
                .then(message => {
                    message.react(emoji);
                })
                .catch(error => {
                    console.error(`Error fetching message: ${error.message}`);
                });
        })
        .catch(error => {
            console.error(`Error fetching channel: ${error.message}`);
        });

    // Set up event listener for reaction roles
    client.on('messageReactionAdd', (reaction, user) => {
        const matchingRoles = reactionRoles.filter(role => role.messageId === reaction.message.id && role.emoji === reaction.emoji.name);
        matchingRoles.forEach(matchingRole => {
            if (!user.bot) {
                const member = reaction.message.guild.members.cache.get(user.id);
                if (member) {
                    member.roles.add(matchingRole.roleId)
                        .then(() => console.log(`Added role ${matchingRole.roleId} to ${user.tag}`))
                        .catch(error => console.error(`Error adding role: ${error.message}`));
                }
            }
        });
    });

    // Set up event listener for unreact if unreact is true
    if (unreact) {
        client.on('messageReactionRemove', (reaction, user) => {
            const matchingRoles = reactionRoles.filter(role => role.messageId === reaction.message.id && role.emoji === reaction.emoji.name);
            matchingRoles.forEach(matchingRole => {
                if (!user.bot) {
                    const member = reaction.message.guild.members.cache.get(user.id);
                    if (member) {
                        member.roles.remove(matchingRole.roleId)
                            .then(() => console.log(`Removed role ${matchingRole.roleId} from ${user.tag}`))
                            .catch(error => console.error(`Error removing role: ${error.message}`));
                    }
                }
            });
        });
    }
};

const getReactionRoles = (client, guildId) => {
    const reactionRoles = dbManager.getServerInfo(guildId).reactionRoles || [];
    return reactionRoles;
};

module.exports = {
    addReactionRole,
    getReactionRoles,
};
