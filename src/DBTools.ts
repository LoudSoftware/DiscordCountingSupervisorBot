import {sequelize} from "./sequelize";
import {logger} from "./log";
import {TextChannel} from "discord.js";
import {CountModel} from "./models/CountModel";
import {CommandoClient} from "discord.js-commando";

export class DBTools {

    public static async checkCountStatus(client: CommandoClient) {

        const dbCount = await CountModel.count();
        // @ts-ignore
        const channel: TextChannel = client.channels.get(numberChannelID);
        const lastMessage = await channel.fetchMessage(channel.lastMessageID);
        const actualCount = parseInt(lastMessage.content);

        logger.debug('DB Count', dbCount);
        logger.debug('Discord count', actualCount);

        if (dbCount !== actualCount) {
            logger.debug('Discord count and actual count mismatch. Wiping the DB and reading the counting channel');

        }

    }
}