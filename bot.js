var eris = require('eris');
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
