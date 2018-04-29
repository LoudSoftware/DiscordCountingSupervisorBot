const Discord = require('discord.js');


module.exports = {
    logoUrl: 'http://gravatar.com/avatar/0a68062bcb04fd6001941b9126dfa9d9.jpg',
    currentNumber: 0,
    topContributors: null,
    topAuthor: null,
    loudSoftware: null,

    name: 'stats',
    description: 'Displays statistics about our counting',
    async execute(message, args) {
        if (args.length !== 0) return;

        this.loudSoftware = message.client.users.get('147410761021390850');

        // Get the current number
        await this.getCurrentNumber(message);
        await this.getMostActive(message);


        // Finally we send the message
        this.sendStats(message);

    },

    async getCurrentNumber(message) {
        return message.client.channels.get(process.env.NUMBER_CHANNEL_ID)
            .fetchMessages({
                limit: 1,
            })
            .then(map => map.array())
            .then(numbersArray => this.currentNumber = parseInt(numbersArray[0].content))
            .catch(error => console.log(error));
    },

    sendStats(message) {
        // somewhere inside a command, an event, etc.
        const embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('Counting Statistics')
            .setAuthor('Number Line Supervisor', this.logoUrl)
            .setThumbnail(this.logoUrl)
            .addField(`We are currently at: ${this.currentNumber}`,
                `This means that we've reached ${Math.floor(this.currentNumber / 500)} milestones.`)
            .addBlankField()
            .addField('Top 2 counters of the month:', `1. ${this.loudSoftware} (All hail the king!) \n2. ${this.topAuthor}`)
            .addBlankField()
            // .addField('Inline field title', 'Some value here', true)
            // .addField('Inline field title', 'Some value here', true)
            // .addField('Inline field title', 'Some value here', true)
            // .setImage(this.logoUrl)
            .setTimestamp()
            .setFooter('Bot Written by LoudSoftware', this.logoUrl);

        message.channel.send({
            embed: embed,
        });
    },

    async getMostActive(message) {
        const monthAuthors = await message.client.channels.get(process.env.NUMBER_CHANNEL_ID)
            .fetchMessages({
                limit: this.currentNumber,
            })
            .then(res => res.array());

        monthAuthors.forEach((item, index, object) => {

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getYear();

            if (item.createdAt.getMonth() !== currentMonth ||
                item.createdAt.getYear() !== currentYear) {
                object.splice(index, 1);
            }
        });

        this.topAuthor = this.processMonthlyMessages(monthAuthors);

    },

    processMonthlyMessages(array) {

        if (array.length === 0) {
            return null;
        }
        const map = {};
        let maxEl = array[0].author;
        let maxCount = 1;
        for (let i = 0; i < array.length; i++) {
            const el = array[i];
            if (map[el] === null) {
                map[el] = 1;
            } else {
                map[el]++;
            }
            if (map[el] > maxCount) {
                maxEl = el;
                maxCount = map[el];
            }
        }
        return maxEl;
    },
};