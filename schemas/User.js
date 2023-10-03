const mongoose = require("mongoose");

const Schema = mongoose.Schema(
    {
        id: String,
        username: String,
        discriminator: String,
        logged: Boolean,
    }
);

const Model = mongoose.model("user", Schema);

module.exports = {
    getUser: async (user) => {
        if (!user) throw new Error("User is required");
        if (!user.id) throw new Error("User Id is required");

        let userDB = await Model.findById(user.id);
        if (!userDB) {
            userDB = new Model({
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
            });
        }

        else if (!userDB.username || !userDB.discriminator) {
            userDB.username = user.username;
            userDB.discriminator = user.discriminator;
        }
        return userDB;
    },

};