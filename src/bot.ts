import * as dotenv from 'dotenv';
// loading the token from the .env file
dotenv.config();
import * as path from 'path';

import { Channel, Message } from 'discord.js';
import { CommandMessage, CommandoClient } from 'discord.js-commando';
import { Checker } from './checker';
import { logger } from './log';
import { CountModel } from './models/CountModel';
import { sequelize } from './sequelize';
import { DBTools } from "./DBTools";

const client = new CommandoClient({
    owner: '147410761021390850',
    commandPrefix: '.',
});

// db stuff
sequelize.addModels([CountModel]);
// const force = process.env.NODE_ENV !== 'development';
CountModel.sync({ force: false }).then(() => logger.debug('finished syncing to DB, sync forced', false));

// various discord connection info
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

        // create a new instance of DBTools and call checkCountStatus
        const dbTools = new DBTools(client);
        dbTools.checkCountStatus().then(() => logger.debug('Done DB/Discord check.'));
    });

client.registry
    .registerGroups([
        ['util', 'Util'],
        ['counting', 'Counting'],
        ['info', 'Info'],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.dispatcher.addInhibitor((message: CommandMessage) => message.channel.id === process.env.NUMBER_CHANNEL_ID);

client.on('commandBlocked', () => null);

client.on("message", (message: Message) => {
    logger.verbose("Received message", message.content);

    if (message.channel.type !== 'dm') {
        const checker = new Checker(message);
        checker.check(message, numberChannel);
    }
});

client.login(token).then((value: string) => logger.debug(value));
