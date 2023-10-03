require('dotenv').config('@config');
const ShibaBot = require('./class/ShibaBot');
const { CheckConfig } = require("./module/CheckConfig");
const { loadMongoose } = require("./handlers/mongoose");

CheckConfig();

loadMongoose();

const client = new ShibaBot();

client.start();


process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);




