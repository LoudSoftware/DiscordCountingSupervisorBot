const Discord = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'Displays statistics about our counting',
    execute(message, args) {

        this.getCurrentNumber(message)
            .then(res => {

                results = res.array();
                currentNumber = results[0].content;

                // somewhere inside a command, an event, etc.
                const embed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('Counting Statistics')
                    .setAuthor('Number Line Supervisor', 'https://i.imgur.com/wSTFkRM.png')
                    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .addField(`We are currently at: ${currentNumber}`,
                        `This means that we've reached ${(currentNumber/500).toFixed(0)} milestones.`)
                    .addBlankField()
                    .addField('Regular field title', 'Some value here')
                    .addField('Inline field title', 'Some value here', true)
                    .addField('Inline field title', 'Some value here', true)
                    .addField('Inline field title', 'Some value here', true)
                    .setImage('https://i.imgur.com/wSTFkRM.png')
                    .setTimestamp()
                    .setFooter('Bot Written by LoudSoftware', 'https://i.imgur.com/wSTFkRM.png');

                message.channel.send({
                    embed: embed
                });

            })


    },

    getCurrentNumber(message) {
        return message.client.channels.get(process.env.NUMBER_CHANNEL_ID).fetchMessages({
            limit: 1
        });

    }
}