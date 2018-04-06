
var echoCommand = bot.registerCommand("echo", (msg, args) => { // Make an echo command
    if(args.length === 0) { // If the user just typed "!echo", say "Invalid input"
        return "I donno da way";
    }
	
	if (isNaN(args[0])) {
		return "This must be a numbah!";
	}
	
	var goal = args[0];

	var epoch = new Date('April 06, 2018');
	
	var timeElapsed = (Date.now() - epoch)/86400000; // milliseconds per day
	var numberperday = currentNumber / timeElapsed;

	if (currentNumber < goal) {
		return ("Will reach " + goal + " in " + parseInt(goal / numberperday) + " days");
	}
	
	return "It has already been reached!";
	
	}, {
		description: "Will return how long until a certain number will be reached",
		fullDescription: "The bot will echo whatever is after the command label.",
		usage: "<text>"
});

