const fs = require('fs');

var logger = require('winston');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "#";

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Loading the token from the .env file
var dotenv = require('dotenv').config();

var token = process.env.BOT_TOKEN;


var botID = (process.env.CLIENT_ID ? process.env.CLIENT_ID : "431866126851506177");
var generalID = (process.env.GENERAL_CHANNEL_ID ? process.env.GENERAL_CHANNEL_ID : "226800861572104195");
var numberChannelID = (process.env.NUMBER_CHANNEL_ID ? process.env.NUMBER_CHANNEL_ID : "431863306509352961");


const channelID = "243191930840809473";

var numberChannel = "";
var generalChannel = "";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


console.log('Attempting to connect to server...');


client.on('ready',
    () => {
        console.log('ready');
        numberChannel = client.channels.get(numberChannelID.toString());
        generalChannel = client.channels.get(generalID.toString());
    });

client.on('message', message => {
    // console.log(message);
    if (message.content.startsWith(prefix) && !message.author.bot && message.channel === generalChannel) {

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args);
        } catch (error) {
            console.log(error);
            message.reply('there was an error trying to execute that command!');
        }
    } else if (message.channel === numberChannel && !message.author.bot) {
        if (isNaN(message.content)) {
            message.delete()
                .then(msg => {
                    generalChannel.send(`Shame... ${message.author} wrote something that was not a number!`);
                });
        } else {
            checkIfPrevious(message);
        }
    }
});


client.login(process.env.BOT_TOKEN.toString());



function checkIfPrevious(msg) {
    getPreviousMessage(msg)
        .then((result) => {
            let previous = result.array();

            if (previous.length != 0) {
                const prevMsg = previous[0];
                console.log(prevMsg.content);
                if ((parseInt(msg.content)) !== (parseInt(prevMsg.content) + 1)) {
                    shame(msg);
                } else {
                    checkMilestone(msg);
                }
            } else {
                // check if input is 0
                if ((parseInt(msg.content)) !== 0){
                    shame(msg);
                }
            }
        });
}


function checkMilestone(msg) {
    const number = msg.content;
    if (number % 500 === 0) { // If number is divisible by 500 run the milestone notification
        generalChannel.send(`Wow! this is amazing, with all our efforts, we reached ${number} Keep it up kappa 😚😚😚`);
    }
}


function shame(msg) {
    msg.delete();
    generalChannel.send(`Shame... ${msg.author} does not believe in true order!`);
}


function getPreviousMessage(msg) {
    return numberChannel.fetchMessages({ limit: 1, before: msg.id });
}