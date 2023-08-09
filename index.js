require('dotenv').config('/config/config');
const ShibaBot = require('./class/ShibaBot');

const client = new ShibaBot();

client.start();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);