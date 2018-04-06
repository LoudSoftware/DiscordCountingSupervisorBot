var Eris = require('eris');
var logger = require('winston');

// Loading the token from the .env file
var dotenv = require('dotenv').config();

token = process.env.BOT_TOKEN;

const channelID = "243191930840809473";
const botID = "431866126851506177";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


console.log('Attempting to connect to server...');

var bot = new Eris.CommandClient(process.env.BOT_TOKEN, {}, {
    description: "Description",
    owner: "@LoudSoftware",
    prefix: "#",
});

bot.registerCommand("ping", "Pong!",{
    description: "pong",
    fullDescription: "does pong",

});

bot.on("ready", () => {
    console.log('Bot ready');
});

bot.on("messageCreate",(msg) => {
    if (msg.channel.id == channelID){
        if(isNaN(msg.content) && msg.author.id != botID){
            msg.delete("No characters!!");
            
            bot.createMessage(channelID, `Shame... ${msg.author.mention} wrote something that was not a number`);
        }
    }
});


bot.connect();
