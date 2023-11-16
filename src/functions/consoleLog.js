/**
 * 
 */

const chalk = require('chalk');
const config = require('@config/config');

function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
}

function getCurrentDate() {
    const now = new Date();
    return now.toISOString().slice(0, 10);
}

function log(message, level = 'info') {
    const allowedLevels = ['info', 'warn', 'error', 'handlers', 'util', 'command', 'check', 'rest'];

    if (!allowedLevels.includes(level)) {
        throw new Error(`Invalid log level: ${level}`);
    }

    const logLevel = config.Logger.logLevel || 'info';
    const messageColor = config.Logger.colors[level] || 'white';

    if (allowedLevels.indexOf(level) >= allowedLevels.indexOf(logLevel)) {
        const currentTime = getCurrentTime();
        const currentDate = getCurrentDate();
        const consolePrefix = config.Logger.consolePrefix;
        const formattedMessage = `[${currentTime}] [${currentDate}] ${consolePrefix} [${level.toUpperCase()}] ${message}`;

        console.log(chalk[messageColor](formattedMessage));
    }
}

module.exports = {
    log,
};