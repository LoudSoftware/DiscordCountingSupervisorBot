import * as fs from 'fs';
import * as path from 'path';

import { Channel, Client, Collection, Message } from 'discord.js';
import { CommandMessage, CommandoClient } from 'discord.js-commando';
import { Checker } from './checker';
import { logger } from './log';

const client = new CommandoClient({
    owner: '147410761021390850',
    commandPrefix: '.',
});

const prefix = '.';

// client.commands = new Collection();
/* const commandFiles = fs.readdirSync("./dist/commands");

for (const file of commandFiles) {
    if (file.split(".")[2] === undefined) {
        const command = require(`./commands/${file}`);
        logger.debug(`Loaded command ${command.name} from ${file}`);
        client.commands.set(command.name, command);
    }
} */

// loading the token from the .env file
require('dotenv').config();

const token = process.env.BOT_TOKEN;

const generalID = process.env.GENERAL_CHANNEL_ID;
const numberChannelID = process.env.NUMBER_CHANNEL_ID;

let numberChannel: Channel;
let generalChannel: Channel;

logger.info('Attempting to connect to server...');

client.on('ready',
    () => {
        logger.info('Connected, bot ready...');
        numberChannel = client.channels.get(numberChannelID.toString());
        generalChannel = client.channels.get(generalID.toString());
        client.user.setActivity('you count...', { type: 'WATCHING' });
    });

client.registry
    .registerGroups([
        ['util', 'Util'],
        ['counting', 'Counting'],
        ['info', 'Info'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('commandBlocked', (msg: CommandMessage, reason: string) => null);

client.on("message", (message: Message) => {
    logger.verbose("Received message", message.content);

    const checker = new Checker(message);
    checker.check(message, numberChannel);
});

client.login(token);
