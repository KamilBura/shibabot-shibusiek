const color = require("colors");
const { readdirSync, lstatSync} = require("fs");
const { join, extname } = require("path");
const permissions = require("./permissions");

module.exports = class Utils {
    static isLink(text) {
        return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            text
        );
    }

    static isDiscordLink(text) {
        return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
            text
        );
    }

    static getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    static isHexColor(text) {
        return /^#[0-9A-F]{6}$/i.test(text);
    }

    // Translate permission code to text
    static parsePermissions(perm) {
        const permission = `permission${perms.length > 1 ? "a" : ""}`;
        return "`" + perm.map((perm) => permissions[perm]).join(", ") + "` " + permission;
    }


}