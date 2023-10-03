// Import required modules from mongoose
const mongoose = require('mongoose');
const { getUser } = require("./User");
const config = require("../config/config");

const Schema = new mongoose.Schema({
    id: String,
    data: {
        name: String,
        region: String,
        owner: { type: String, ref: "users" },
        joinedAT: Date,
        leftAT: Date,
    },
    Prefix: { type: String, default: config.PrefixCommands.defaultPrefix},

});

const Model = mongoose.model("guild", Schema);

module.exports = {
    getSettings: async (guild) => {
        if (!guild) throw new Error("Guild is undefined");
        if (!guild.id) throw new Error("GuildID is undefined");

        let guildData = await Model.findById(guild.id);
        if (!guildData) {
            guild
                .fetchOwner()
                .then(async (owner) => {
                    const userDB = await getUser(owner);
                    await userDB.save();
                })
                .catch((error) => {});

            guildData = new Model({
                id: guild.id,
                data: {
                    name: guild.name,
                    region: guild.preferredLocale,
                    owner: guild.ownerID,
                    joinedAT: guild.joinedAT,
                },
            });

            await guildData.save();
        }
        return guildData;
    },
};