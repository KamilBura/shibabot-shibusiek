// Importing required libraries
const colors = require("colors"); // For adding colors to console output
const winston = require("winston"); // Logging library
const config = require("../config/config"); // Import configuration settings

// Get the current date and time
let Calendar = new Date();
const hours = Calendar.getHours().toString().padStart(2, '0');
const minutes = Calendar.getMinutes().toString().padStart(2, '0');
const seconds = Calendar.getSeconds().toString().padStart(2, '0');
const day = Calendar.getDate().toString().padStart(2, '0');
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dev"];
const month = Calendar.getMonth();


// Define a class for handling command logging
class CommandLog {
    constructor(file) {
        // Create a logger instance for logging messages to a file
        this.CommandLog = winston.createLogger({
            transports: [new winston.transports.File({ filename: file })],
        });

    }
    
    // Log an information message
    log(InputText) {
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Info] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.green("[Info] ") + colors.green(InputText),
        );

    }

    // Log a warning message
    warn(InputText) {
        // Similar structure as the log() method
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Warning] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.yellow("[Warning] ") + colors.yellow(InputText),
        );
    }

    // Log an error message
    error(InputText) {
        // Similar structure as the log() method
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Warning] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.red("[Error] ") + colors.red(InputText),
        );
    }

    // Log a Lavalink related message
    lavalink(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[Lavalink] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.cyan("[Lavalink] ") + colors.brightRed(InputText),
        );
    }

    // Log a music player related message
    musicplayer(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "warn",
            message: "[MusicPlayer] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.brightCyan("[MusicPlayer] ") + colors.brightRed(InputText),
        );
    }

}

// Export the CommandLog class for use in other modules
module.exports = CommandLog;