import { logger } from "./log";
import { Collection, Message, Snowflake, TextChannel } from "discord.js";
import { CountModel } from "./models/CountModel";
import { CommandoClient } from "discord.js-commando";

export class DBTools {

    public dbCount: number;
    public discordCount: number;

    private client: CommandoClient;
    private numberChannelID: string = process.env.NUMBER_CHANNEL_ID;
    private numberChannel: TextChannel;

    constructor(client: CommandoClient) {
        this.client = client;
        // @ts-ignore
        this.numberChannel = client.channels.get(this.numberChannelID);
    }

    public async checkCountStatus() {

        this.dbCount = await this.getDBCount();
        this.discordCount = await this.getDiscordCount();

        logger.debug('DB Count', this.dbCount);
        logger.debug('Discord count', this.discordCount);

        if (this.dbCount !== this.discordCount) {
            logger.debug('Discord count and actual count mismatch. Wiping the DB and reading the counting channel');
            // we wipe the db and start the backup
            if (this.dbCount !== 0) await this.wipeDB();
            await this.startBackup();

        }
    }

    private async getDiscordCount(): Promise<number> {
        const lastMessage = await this.numberChannel
            .fetchMessages({ limit: 1 })
            .then((coll: Collection<Snowflake, Message>) => coll.array()[0]);
        return parseInt(lastMessage.content);
    }

    private async getDBCount(): Promise<number> {
        return await CountModel.count() - 1;
    }

    private async wipeDB() {
        await CountModel.drop();
        await CountModel.sync();
    }

    private async startBackup() {
        const fullBackupArray: Message[] = [];

        let currentMessage: Message = await this.numberChannel.fetchMessages({ limit: 1 })
            .then((collection: Collection<Snowflake, Message>) => collection.array())
            .then((messages: Message[]) => messages[0]);

        fullBackupArray.push(currentMessage);

        while (true) {
            if (currentMessage.content === "0") break;
            const messages: any = await this.numberChannel.fetchMessages({ before: currentMessage.id })
                .catch((err: any) => logger.error(err));

            const array: Message[] = messages.array();
            logger.debug('Current Messages Array', array.length);

            // fullBackupArray.concat(array);
            array.forEach((elem: Message) => {
                fullBackupArray.push(elem);
            });
            currentMessage = array[array.length - 1];
        }

        logger.debug('Full Backup length', fullBackupArray.length);
        fullBackupArray.reverse();
        fullBackupArray.forEach((elem: Message) => {
            CountModel.create({ author: elem.author.id, number: parseInt(elem.content), date: elem.createdAt });
        });

        logger.debug('Counting channel backup completed!');
    }
}