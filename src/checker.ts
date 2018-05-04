import { Channel, Guild, Message } from 'discord.js';
import { logger } from './log';

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

    public ping() {
        if (this.message.author.bot) return;

        console.log('pong');
        const channel = this.message.guild.channels.find('name', 'general');
        return channel.send('pong');
    }

    public check(message: Message, numberChannel: Channel) {
        if (message.channel === numberChannel && !message.author.bot) {
            if (isNaN(parseInt(message.content))) {
                message.delete()
                    .then((msg: Message) => {
                        this.generalChannel.send(`Shame... ${msg.author} wrote something that was not a number!`);
                    });
            } else {
                this.checkIfPrevious(message);
            }
        }
    }

    private checkIfPrevious(msg: Message) {
        this.getPreviousMessage(msg)
            .then((result: any) => {
                const previous = result.array();

                if (previous.length !== 0) {
                    const prevMsg = previous[0];
                    logger.debug(`Previous was: ${prevMsg.content}, Current is: ${msg.content}`);
                    if ((parseInt(msg.content)) !== (parseInt(prevMsg.content) + 1)) {
                        this.shame(msg);
                    } else {
                        this.checkMilestone(msg);
                    }
                } else if ((parseInt(msg.content)) !== 0) {
                    this.shame(msg);
                }

            });
    }

    private checkMilestone(msg: Message) {
        const num: number = parseInt(msg.content);
        if (num % 500 === 0) {
            // if number is divisible by 500 run the milestone notification
            this.generalChannel.send(`Wow! this is amazing, with all our efforts, we reached ${num} Keep it up kappa 😚😚😚`);
        }
    }

    private shame(msg: Message) {
        msg.delete();
        this.generalChannel.send(`Shame! ${msg.author} does not believe in true order...`);
        // generalChannel.send(`Shame... ${msg.author} does not believe in true order!`);
    }

    private getPreviousMessage(msg: Message) {
        return this.numberChannel.fetchMessages({
            limit: 1,
            before: msg.id,
        });
    }
}
