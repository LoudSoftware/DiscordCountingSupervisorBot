var Eris = require('eris');
var logger = require('winston');

// Loading the token from the .env file
var dotenv = require('dotenv').config();

token = process.env.BOT_TOKEN;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot

var bot = new Eris(process.env.BOT_TOKEN);
bot.on("ready", () => {
    console.log("Ready!");
});
bot.on("messageCreate", (msg) => {
    if(msg.content === "#ping") {
        bot.createMessage(msg.channel.id, "Pong!");
    }
});
bot.connect();
