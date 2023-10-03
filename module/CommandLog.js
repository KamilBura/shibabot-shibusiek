// Importing required libraries
const colors = require("colors"); // For adding colors to console output
const winston = require("winston"); // Logging library
const config = require("../config/config"); // Import configuration settings
const path = require("path");

// Get the current date and time
let Calendar = new Date();
const hours = Calendar.getHours().toString().padStart(2, '0');
const minutes = Calendar.getMinutes().toString().padStart(2, '0');
const seconds = Calendar.getSeconds().toString().padStart(2, '0');
const day = Calendar.getDate().toString().padStart(2, '0');
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dev"];
const month = Calendar.getMonth();


// Define a class for handling command logging
class Logger {
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
            ) + colors.yellow(config.consolePrefix) + " " + colors.green("[Info] ") + colors.brightGreen(InputText),
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
            ) + colors.yellow(config.consolePrefix) + " " + colors.yellow("[Warning] ") + colors.brightYellow(InputText),
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
            ) + colors.yellow(config.consolePrefix) + " " + colors.red("[Error] ") + colors.brightRed(InputText),
        );
    }

    // Log a Lavalink related message
    lavalink(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Lavalink] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.cyan("[Lavalink] ") + colors.brightCyan(InputText),
        );
    }

    // Log a music player related message
    musicplayer(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[MusicPlayer] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.cyan("[MusicPlayer] ") + colors.brightCyan(InputText),
        );
    }

    commandLoad(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Commands] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.green("[Commands] ") + colors.brightGreen(InputText),
        );
    }

    eventLoad(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Events] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.green("[Events] ") + colors.brightGreen(InputText),
        );
    }

    verifer(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Verifer] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.cyan("[Verification] ") + colors.brightCyan(InputText),
        );
    }

    mongoose(InputText) {
        // Similar structure as the log() method, but with different colors and labels
        this.CommandLog.log({
            time: `${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }`,
            level: "info",
            message: "[Mongoose] " + InputText,
        });
        console.log(
            colors.gray(
                `[${ day } ${ months[month] } ${ Calendar.getFullYear() } - ${ hours }:${ minutes }:${ seconds }]`,
            ) + colors.yellow(config.consolePrefix) + " " + colors.yellow("[Mongoose] ") + colors.brightYellow(InputText),
        );
    }

};

 // Create a log file name based on the current date
 const currentDate = new Date();
 const formattedDate = currentDate.toLocaleDateString('en-GB', {
     day: '2-digit',
     month: '2-digit',
     year: 'numeric'
 }).replace(/\//g, '-');
 const logFileName = `logs-${formattedDate}.log`;

 // Define the path to the log file
 const logFilePath = path.join(__dirname, "..", "/log", logFileName);

 // Initialize the CommandLog instance
 this.LoggerInstance = new Logger(logFilePath);

module.exports = {
    log: this.LoggerInstance.log.bind(this.LoggerInstance),
    warn: this.LoggerInstance.warn.bind(this.LoggerInstance),
    error: this.LoggerInstance.error.bind(this.LoggerInstance),
    lavalink: this.LoggerInstance.lavalink.bind(this.LoggerInstance),
    musicplayer: this.LoggerInstance.musicplayer.bind(this.LoggerInstance),
    commandLoad: this.LoggerInstance.commandLoad.bind(this.LoggerInstance),
    eventLoad: this.LoggerInstance.eventLoad.bind(this.LoggerInstance),
    verifer: this.LoggerInstance.verifer.bind(this.LoggerInstance),
    mongoose: this.LoggerInstance.mongoose.bind(this.LoggerInstance),

}