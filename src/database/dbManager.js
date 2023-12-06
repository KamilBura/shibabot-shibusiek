const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync')
const { log } = require('../functions/consoleLog');
const config = require('../config/config');

const adapter = new FileAsync('./src/database/db.json');
let db;

const initializeDatabase = async () => {
    db = await low(adapter);
    await db.defaults({
    }).write();
};

const createServerTable = async (guild) => {
    //console.log('Guild Object:', guild);

    if (!guild || !guild.id || !guild.name) {
        log('Invalid guild object in createServerTable', 'error');
        return;
    }

    const serverTable = `server_${guild.id}`;
    const serverData = {
        guildid: guild.id,
        guildname: guild.name,
        membercount: guild.memberCount,
        ownerid: guild.ownerId,
        serverCreationDate: guild.createdAt ? guild.createdAt.toISOString() : new Date().toISOString(),
        botJoinDate: new Date().toISOString(),
        reactionRoles: [], // Add an empty array for reactionRoles
    };

    await db.set(serverTable, serverData).write();
};

const updateServerInfo = (guild) => {
    const serverTable = `server_${ guild.id}`;
    db.set(`${serverTable}.guildname`, guild.name).write();
    db.set(`${serverTable}.membercount`, guild.memberCount).write();
};

const getServerInfo = (guildId) => {
    const serverTable = `server_${guildId}`;
    return db.get(serverTable).value();
}

const setBotJoinDate = (guild) => {
    const serverTable = `server_${ guild.id}`;
    db.set(`${serverTable}.botJoinDate`, new Date().toISOString()).write();
};

module.exports = {
    initializeDatabase,
    createServerTable,
    updateServerInfo,
    getServerInfo,
    setBotJoinDate,
};