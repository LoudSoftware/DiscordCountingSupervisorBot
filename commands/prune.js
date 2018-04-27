module.exports = {
    name: 'prune',
    description: `Prune up to 99  messages`,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        }
        else if (amount <= 1 || amount > 100 || message.author.id !== "147410761021390850") {
            return message.reply('you need to input a number between 1 and 99.');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.log(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
    },
};