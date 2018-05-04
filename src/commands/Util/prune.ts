import { Collection, Message } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';

export default class Prune extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'prune',
            aliases: ['clean', 'purge', 'clear'],
            memberName: 'prune',
            group: 'util',
            description: 'Prune up to 99 messages',
            guildOnly: true,
            args: [
                {
                    key: 'amount',
                    prompt: 'How many messages would you like to delete?\n',
                    type: 'integer',
                    max: 99,
                    min: 1
                }
            ]
        });
    }

    public hasPermission(msg: CommandMessage): boolean {
        return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES');
    }

    public async run(message: CommandMessage, args: {amount: number }): Promise<Message| Message[]> {

        // if (message.channel.id === process.env.NUMBER_CHANNEL_ID) return;

        let { amount } = args;
        amount ++;

        message.channel.bulkDelete(amount, true).catch((err: Promise<void | Collection<string, Message>>) => {
            console.log(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
        // tslint:disable-next-line:no-null-keyword
        return null;
    }
}
