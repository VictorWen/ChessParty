const { ActivityFlags } = require("discord.js");

class ChessBoard {
    constructor(players) {
        this.players = players; // players is an array of uids
        this.white_space = "　";
        this.black_space = "口"

        this.pieces = {
            'White Rook': '♜',
            'White Knight': '♞',
            'White Bishop': '♝',
            'White Queen': '♛',
            'White King': '♚',
            
            'Black Rook': '♖',
            'Black Knight': '♘',
            'Black Bishop': '♗',
            'Black Queen': '♕',
            'Black King': '♔',

            'Empty Space': 'EMPTY'
        }

        this.black = [];
        this.white = [];
        this.shuffle_teams();

        this.board = [];
        this.reset_board();
    }

    shuffle_teams() {
        this.white = [];
        globalThis.black = [];

        let n_players = this.players.length;
        let count = 0;
        let chosen = new Set();
        while (count < n_players) {
            let choice = Math.floor(Math.random() * n_players);
            while (chosen.has(choice))
                choice = Math.floor(Math.random() * n_players);
            chosen.add(choice);
            this.white.push(this.players[choice]);
            
            count++;
            if (count == n_players)
                break;

            choice = Math.floor(Math.random() * n_players);
            while (chosen.has(choice))
                choice = Math.floor(Math.random() * n_players);
            chosen.add(choice);
            this.black.push(this.players[choice]);

            count++;
        }
    }

    get_empty_space(row, col) {
        return (row + col) % 2 == 0 ? this.white_space : this.black_space;
    }

    reset_board() {
        for (let i = 0; i < 8; i++) {
            this.board[i] = [];
            for (let j = 0; j < 8; j++) {
                this.board[i][j] = this.get_empty_space(i, j);
            }
        }
        this.board[7] = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
        this.board[6] = ['♟︎', '♟︎', '♟︎', '♟︎', '♟︎', '♟︎', '♟︎', '♟︎'];
        this.board[1] = ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'];
        this.board[0] = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
    }

    get_board_string() {
        let output = "";
        this.board.forEach(row => {
            row.forEach(cell => {
                output += cell;
            });
            output += '\n';
        });
        return output;
    }

    get_board_string_with_labels() {
        let output = "";
        let digits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
        let count = 8;
        this.board.forEach(row => {
            output += digits[count -1] + " | ";
            count--;
            row.forEach(cell => {
                output += cell;
            });
            output += '\n';
        });
        output += "///+---------------------\n"
        output += "/// -A-B-C-D-E-F-G-H"
        return output;
    }

    is_valid_coord(coord) {
        let first = coord.charCodeAt(0);
        let second = coord.charCodeAt(1);
        return 65 <= first && first <= 72 && 49 <= second && second <= 56;
    }

    convert_coord(coord) {
        let letter = coord.charCodeAt(0) - 65;
        let number = 56 - coord.charCodeAt(1);
        return [letter, number];
    }

    move(coord1, coord2) {
        if (!this.is_valid_coord(coord1) || !this.is_valid_coord(coord2))
            return false;
        coord1 = this.convert_coord(coord1);
        coord2 = this.convert_coord(coord2);
        let cell = this.board[coord1[1]][coord1[0]];
        this.board[coord1[1]][coord1[0]] = this.get_empty_space(coord1[1], coord1[0])
        this.board[coord2[1]][coord2[0]] = cell;        
        return true;
    }

    place_piece(coord, piece_code) {
        if (!(piece_code in this.pieces) || !this.is_valid_coord(coord))
            return false;
        coord = this.convert_coord(coord);
        if (this.pieces[piece_code] == "EMPTY")
            this.board[coord[1]][coord[0]] = this.get_empty_space(coord[1], coord[0]);
        else
            this.board[coord[1]][coord[0]] = this.pieces[piece_code];
        return true;
    }
}

module.exports = ChessBoard;