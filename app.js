const Discord = require('discord.js');
const ChessBoard = require('./chess_board.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client();
const Buttons = require('discord-buttons');
Buttons(client);

commands = {};
let board;
let place_coord;

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
    await channel.send("", { embed: { description: board.get_board_string_with_labels() } });
}

commands["reset"] = async function(channel, args) {
    board.reset_board();
    await show_board(channel);
}

commands["show"] = async function(channel, args) {
    await show_board(channel);
}

let move = async function(channel, args) {
    if (args.length < 2 || !board.move(args[0].toUpperCase(), args[1].toUpperCase())) {
        await channel.send("**INVALID MOVE**")
    }
    else
        await show_board(channel);
}
commands["move"] = move;
commands["m"] = move;

let place = async function(channel, args) {
    if (args.length < 1 || !board.is_valid_coord(args[0].toUpperCase())) {
        channel.send("**INVALID COORDINATE**");
        return;
    }
    
    place_coord = args[0].toUpperCase();

    let menu = new Buttons.MessageMenu()
        .setID("placementMenu")
        .setPlaceholder("Choose a piece")
        .setMinValues(1)
        .setMaxValues(1);

    for (const key in board.pieces) {
        menu.addOption(new Buttons.MessageMenuOption()
            .setLabel(board.pieces[key])
            .setDescription(key)
            .setValue(key));
    }

    channel.send("Choose a piece", menu);
}
commands["place"] = place;
commands["p"] = place;

client.on('clickMenu', async menu => {
    if (menu.id == "placementMenu") {
        board.place_piece(place_coord, menu.values[0])
        await menu.message.delete();
        await show_board(menu.channel);
    }
});

client.login(token);