const Discord = require('discord.js');
const ChessBoard = require('./chess_board.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client();

commands = {};
let board; 

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
    board = new ChessBoard([123, 321]);
});

client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(prefix))
        return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command in commands)
        await commands[command](message.channel, args);
})

async function show_board(channel) {
    await channel.send("", {embed: {description: board.get_board_string_with_labels()}});
}

commands["reset"] = async function(channel, args) {
    board.reset_board();
    await show_board(channel);
}

commands["show"] = async function(channel, args) {
    await show_board(channel);
}

commands["move"] = async function(channel, args) {
    if (!board.move(args[0], args[1])) {
        await channel.send("**INVALID MOVE**")
    }
    else
        await show_board(channel);
}

client.login(token);