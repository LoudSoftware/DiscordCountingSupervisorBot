import { User, Message, RichEmbed, Channel, TextChannel } from "discord.js";
import { logger } from "../../log";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

export default class Stats extends Command {
    private logoUrl: string = "http://gravatar.com/avatar/0a68062bcb04fd6001941b9126dfa9d9.jpg";
    private currentNumber: number;
    private topContributors: string[];
    private topAuthors: any[];
    private loudSoftware: User;


    constructor(client: CommandoClient) {
        super(client, {
            name: "stats",
            aliases: ["statistics", "stat", "s"],
            memberName: "stats",
            description: "Displays various stats based on current count",
            group: "counting",

        });
    }

    public async run(message: CommandMessage): Promise<Message | Message[]> {

        this.loudSoftware = message.client.users.get("147410761021390850");

        // Get the current number
        await this.getCurrentNumber(message);
        await this.getMostActive(message);


        // Finally we send the message
        this.sendStats(message);
        return undefined;

    }

    private async getCurrentNumber(message: CommandMessage) {
        return message.client.channels.get(process.env.NUMBER_CHANNEL_ID)
            .fetchMessages({
                limit: 1,
            })
            .then(map => map.array())
            .then(numbersArray => this.currentNumber = parseInt(numbersArray[0].content))
            .catch(error => logger.error(error));
    }

    private sendStats(message: CommandMessage) {
        // somewhere inside a command, an event, etc.
        const embed = new RichEmbed()
            .setColor("#0099ff")
            .setTitle("Counting Statistics")
            .setAuthor("Number Line Supervisor", this.logoUrl)
            .setThumbnail(this.logoUrl)
            .addField(`We are currently at: ${this.currentNumber}`,
                `This means that we've reached ${Math.floor(this.currentNumber / 500)} milestones.`)
            .addBlankField()
            .addField("Top 3 counters of the Month:",
                `1.  ${this.topAuthors[0]} (All hail the king!)
2. ${(this.topAuthors[1] === undefined ? "You let him count alone??" : this.topAuthors[1])}
3. ${(this.topAuthors[2] === undefined ? "Hmm, nobody here" : this.topAuthors[2])}

(right now I am stoopid bot that only looks at the last 100 messages My master is fixing things but he could be quite lazy sometimes...)`)
            .addBlankField()
            // .addField('Inline field title', 'Some value here', true)
            // .addField('Inline field title', 'Some value here', true)
            // .addField('Inline field title', 'Some value here', true)
            // .setImage(this.logoUrl)
            .setTimestamp()
            .setFooter("Bot Written by LoudSoftware", this.logoUrl);

        message.channel.send({
            embed: embed,
        });
    }

    private async getMostActive(message: CommandMessage) {
        const channel = message.client.channels.get(process.env.NUMBER_CHANNEL_ID);
        const monthAuthors = await channel.fetchMessages({
                limit: 100,
            })
            .then(res => res.array());


        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        monthAuthors.forEach((item: CommandMessage, index: number, object) => {

            if (item.createdAt.getMonth() !== currentMonth ||
                item.createdAt.getFullYear() !== currentYear) {
                object.splice(index, 1);
            }
        });

        const topAuthorIDs = this.processMonthlyMessages(monthAuthors);
        topAuthorIDs.forEach((elem: string, index: number) => {
            this.topAuthors[index] = message.client.users.get(elem);
        });

        logger.debug("Top author of the month (based on the last 100 messages):", this.topAuthors[0].username);

    }

    private processMonthlyMessages(array): string[] {

        if (array.length === 0) {
            return undefined;
        }

        const map = new Map();
        for (let i = 0; i < array.length; i++) {
            const el = array[i].author.id;
            if (map.get(el) === undefined) {
                map.set(el, 1);
            } else {
                map.set(el, map.get(el) + 1);
            }
        }

        map[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        };

        const result = [];

        logger.debug("Top of month are:");
        for (let i = 0; i < map.size && i < 3; i++) {
            result[i] = [...map][i][0];
            logger.debug(i, result[i]);
        }
        logger.debug("");

        return result;
    }
}