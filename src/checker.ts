import { Channel, Collection, Guild, Message, Snowflake } from 'discord.js';
import { logger } from './log';
import { CountModel } from "./models/CountModel";

export class Checker {

    private message: Message;
    private guild: Guild;
    private numberChannel: Channel;
    private generalChannel: Channel;

    constructor(message: Message) {
        this.message = message;
        this.guild = message.guild;
        this.generalChannel = this.guild.channels.get(process.env.GENERAL_CHANNEL_ID);
        this.numberChannel = this.guild.channels.get(process.env.NUMBER_CHANNEL_ID);
    }

    public async check(message: Message, numberChannel: Channel) {
        if (message.channel === numberChannel && !message.author.bot) {
            if (isNaN(parseInt(message.content))) {
                await message.delete();
                // @ts-ignore
                this.generalChannel.send(`Shame... ${message.author} wrote something that was not a number!`);
            } else {
                this.checkIfPrevious(message);
            }
        }
    }

    private async checkIfPrevious(msg: Message) {
        const messages: Collection<Snowflake, Message> = await this.getPreviousMessage(msg);
        const previous = messages.array();

        if (previous.length !== 0) {
            const prevMsg = previous[0];
            logger.debug(`Previous was: ${prevMsg.content}, Current is: ${msg.content}`);
            if ((parseInt(msg.content)) !== (parseInt(prevMsg.content) + 1)) {
                this.shame(msg);
            } else {
                // create new model and save to the db
                CountModel.create({
                    author: msg.author.id,
                    number: parseInt(msg.content),
                    date: msg.createdAt
                });

                // check if we reached a milestone
                this.checkMilestone(msg);
            }
        } else if ((parseInt(msg.content)) !== 0) {
            this.shame(msg);
        }
    }

    private checkMilestone(msg: Message) {
        const num: number = parseInt(msg.content);
        if (num % 500 === 0) {
            // if number is divisible by 500 run the milestone notification
            // @ts-ignore
            this.generalChannel.send(`Wow! this is amazing, with all our efforts, we reached ${num} Keep it up kappa 😚😚😚`);
        }
    }

    private shame(msg: Message) {
        msg.delete();
        // @ts-ignore
        this.generalChannel.send(`Shame! ${msg.author} does not believe in true order...`);
        // generalChannel.send(`Shame... ${msg.author} does not believe in true order!`);
    }

    private getPreviousMessage(msg: Message): Collection<Snowflake, Message> {
        // @ts-ignore
        return this.numberChannel.fetchMessages({
            limit: 1,
            before: msg.id,
        });
    }
}
