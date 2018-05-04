import { Channel, Collection, Message, RichEmbed, Snowflake, TextChannel, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { logger } from "../../log";

export default class Until extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'until',
            aliases: ['timeuntil', 'when'],
            memberName: 'until',
            group: 'counting',
            description: 'Displays the number of days until we reach given goal',
            args: [
                {
                    key: 'goal',
                    prompt: 'What goal do you want to estimate?\n',
                    type: 'integer',
                    min: 1,
                }
            ],
            argsCount: 1,
        });
    }

    public hasPermission(message: CommandMessage) {
        return (message.channel.id === process.env.NUMBER_CHANNEL_ID ? null : true);
    }
    public async run(message: CommandMessage, args: { goal: number }): Promise<Message | Message[]> {

        if (message.channel.id === process.env.NUMBER_CHANNEL_ID) return;

        await this.getCurrentNumber(message, args);
        return null;
    }

    private async getCurrentNumber(message: CommandMessage, args: { goal: number }) {
        const goal = args.goal;

        const epoch: any = new Date('April 06, 2018');

        const now = Date.now();

        const timeElapsed = (now - epoch) / 86400000; // milliseconds per day

        return message.client.channels.get(process.env.NUMBER_CHANNEL_ID)
            .fetchMessages({
                limit: 1,
            })
            .then((result: Collection<Snowflake, Message>) => {
                const previous = result.array();

                if (previous.length !== 0) {
                    const currentNumber = parseInt(previous[0].content);
                    const numberPerDay = currentNumber / timeElapsed;

                    if (currentNumber < goal) {
                        return message.channel.send(`With our current rate, we should reach ${goal} in about ${(goal / numberPerDay).toFixed(2)} days!`);
                    }
                    return message.channel.send('We already reached that point you little cuck!');
                }
            });

    }
}