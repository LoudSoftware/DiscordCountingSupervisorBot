var Eris = require('eris');
var logger = require('winston');

// Loading the token from the .env file
var dotenv = require('dotenv').config();

token = process.env.BOT_TOKEN;

const botID = "431866126851506177";
const channelID = "243191930840809473";
const generalID = "226800861572104195";
const numberChannel = "431863306509352961";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


console.log('Attempting to connect to server...');

var bot = new Eris.CommandClient(process.env.BOT_TOKEN, {}, {
    description: "Description",
    owner: "Loud",
    prefix: "#",
});

bot.on("ready", () => {
    console.log('Bot ready');
});

bot.on("messageCreate", (msg) => {
    if (msg.channel.id == numberChannel) {
        // Character detection
        if (isNaN(msg.content) && msg.author.id != botID) {
            msg.delete("No characters!!");

            bot.createMessage(generalID, `Shame... ${msg.author.mention} wrote something that was not a number`);
        } else {
            checkIfPrevious(msg);
        }

        console.log('something else');


    }
});

function checkIfPrevious(msg) {
    getPreviousMessage(msg).then((result) => {
        let previous = result[0];
        console.log(previous.content);
        if ((parseInt(msg.content)) != (parseInt(previous.content) + 1)) {
            shame(msg);
        }
    });
}


function shame(msg) {
    msg.delete("Not following sequence");

    bot.createMessage(generalID, `Shame... ${msg.author.mention} does not believe in true order!`);
}


function getPreviousMessage(msg) {
    return bot.getMessages(numberChannel, 1, msg.id);
}

// Gets all the messages as numbers from the counting channel
function getAllMessagesAsNumbers() {
    var messages;
    bot.getMessages(numberChannel, 100000).then((result) => {
        messages = result;

        console.log('Got messages');

        for (var message in messages) {
            console.log(message);
        }
    });
}

bot.connect();
