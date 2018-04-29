const fs = require('fs');

const Eris = require('eris');
const logger = require('winston');
const prefix = '#';


// Loading the token from the .env file
const dotenv = require('dotenv').config();

const token = process.env.BOT_TOKEN;


const botID = (process.env.CLIENT_ID ? process.env.CLIENT_ID : '431866126851506177');
const generalID = (process.env.GENERAL_CHANNEL_ID ? process.env.GENERAL_CHANNEL_ID : '226800861572104195');
const numberChannel = (process.env.NUMBER_CHANNEL_ID ? process.env.NUMBER_CHANNEL_ID : '431863306509352961');


const channelID = '243191930840809473';


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true,
});
logger.level = 'debug';


console.log('Attempting to connect to server...');

const bot = new Eris.CommandClient(token, {}, {
    description: 'Description',
    owner: 'Loud',
    prefix: prefix,
});

bot.on('ready', () => {
    console.log('Bot ready');
});

bot.on('messageCreate', (msg) => {
    if (msg.channel.id === numberChannel) {
        // Character detection
        if (isNaN(msg.content) && msg.author.id !== botID) {
            msg.delete('No characters!!');

            bot.createMessage(generalID, `Shame... ${msg.author.mention} wrote something that was not a number`);
        }
        else {
            checkIfPrevious(msg);
        }
    }
});

function checkIfPrevious(msg) {
    getPreviousMessage(msg).then((result) => {
        const previous = result[0];
        if (previous != null) {
            console.log(previous.content);
            if ((parseInt(msg.content)) !== (parseInt(previous.content) + 1)) {
                shame(msg);
            }
            else {
                checkMilestone(msg);
            }
        }
    });
}


function checkMilestone(msg) {
    const number = msg.content;
    if (number % 500 === 0) { // If number is divisible by 500 run the milestone notification
        bot.createMessage(generalID, `Wow! this is amazing, with all our efforts, we reached ${number} Keep it up kappa 😚😚😚`);
    }
}


function shame(msg) {
    msg.delete('Not following sequence');

    bot.createMessage(generalID, `Shame... ${msg.author.mention} does not believe in true order!`);
}


function getPreviousMessage(msg) {
    return bot.getMessages(numberChannel, 1, msg.id);
}

// Gets all the messages as numbers from the counting channel
function getAllMessagesAsNumbers() {
    let messages;
    bot.getMessages(numberChannel, 100000).then((result) => {
        messages = result;

        console.log('Got messages');

        for (const message in messages) {
            console.log(message);
        }
    });
}

bot.connect();
