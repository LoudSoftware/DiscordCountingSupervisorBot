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

        let { amount } = args;
        amount ++;

        message.channel.bulkDelete(amount, true).catch((err: any) => {
            console.log(err);
            message.channel.send('There was an error trying to prune messages in this channel!');
        });
        return null;
    }
}
