import { Message, RichEmbed, User } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

export default class InfoCommanmd extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: "info",
            aliases: ["about", "bot"],
            group: "info",
            memberName: "info",
            description: "Displays info about the bot",
        });
    }

    private loudSoftware: User;
    private logoUrl: "http://gravatar.com/avatar/0a68062bcb04fd6001941b9126dfa9d9.jpg";

    public async run(message: CommandMessage): Promise<Message| Message[]> {

        this.loudSoftware = message.client.users.get("147410761021390850");

        const embed = new RichEmbed()
            .setColor("#0099ff")
            .setAuthor("Bot Info", this.logoUrl)
            .setThumbnail(this.logoUrl)
            .addField(`Written by:`, this.loudSoftware)
            .addField("Github:", "https://github.com/LoudSoftware")
            .addField("Bot Repository:", "[Repo](https://github.com/LoudSoftware/DiscordCountingSupervisorBot)")
            .addField("My Website:", "[LoudSoftware](https://LoudSoftware.github.io/)")
            .setURL("https://LoudSoftware.github.io/")
            .setFooter("Bot Info", this.logoUrl)
            .setTimestamp();

        return message.channel.send({
            embed: embed,
        });

    }
}