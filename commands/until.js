module.exports = {
    name: 'until',
    description: 'Sends time until we reach the number given by the user',
    async execute(message, args) {

        if (args.length === 0) {
            // If the user just typed "!echo", say "Invalid input"
            return message.reply('You need to show me da wey!');
        }

        if (isNaN(args[0])) {
            return message.reply('This must be a numbah!');
        }

        
        await this.getCurrentNumber(message, args);

    },

    async getCurrentNumber(message, args) {

        const goal = parseInt(args[0]);

        const epoch = new Date('April 06, 2018');

        const timeElapsed = (Date.now() - epoch) / 86400000; // milliseconds per day

        return message.client.channels.get(process.env.NUMBER_CHANNEL_ID)
            .fetchMessages({
                limit: 1,
            })
            .then(result => {
                const previous = result.array();

                if (previous.length != 0) {
                    const currentNumber = parseInt(previous[0].content);
                    const numberPerDay = currentNumber / timeElapsed;

                    if (currentNumber < goal) {
                        return message.channel.send(`With our current rate, we should reach ${goal} in about ${(goal / numberPerDay).toFixed(2)} days!`);
                    }
                    return message.channel.send('We already reached that point you little cuck!');
                }
            });

    },
};