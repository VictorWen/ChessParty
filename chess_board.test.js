const ChessBoard = require('./chess_board.js')

// Test construction and team generation
let players = [123, 432, 321];
let board = new ChessBoard(players);

test("Players' length", () => { expect(board.players.length).toBe(3); });

test("Team lengths", () => {
    expect(board.white.length).toBe(Math.ceil(players.length / 2));
    expect(board.black.length).toBe(Math.floor(players.length / 2));
});

test("No duplicates between teams", () => {
    expect(board.white).toEqual(expect.not.arrayContaining(board.black));
});

test("No duplicates within teams", () => {
    function isUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    let u_white = board.white.filter(isUnique);
    expect(board.white.length).toBe(u_white.length);

    let u_black = board.black.filter(isUnique);
    expect(board.black.length).toBe(u_black.length);
});

test("Board placement", () => {
    w = board.white_space;
    b = board.black_space;
    expect(board.get_board_string()).toBe(
        "♖♘♗♕♔♗♘♖\n" +
        "♙♙♙♙♙♙♙♙\n" +
        w + b + w + b + w + b + w + b + "\n" +
        b + w + b + w + b + w + b + w + "\n" +
        w + b + w + b + w + b + w + b + "\n" + 
        b + w + b + w + b + w + b + w + "\n" +
        "♟︎♟︎♟︎♟︎♟︎♟︎♟︎♟︎\n" +
        "♜♞♝♛♚♝♞♜\n"
    )
    expect(board.get_board_string_with_labels()).toBe(
        "8️⃣ | ♖♘♗♕♔♗♘♖\n" +
        "7️⃣ | ♙♙♙♙♙♙♙♙\n" +
        "6️⃣ | " + w + b + w + b + w + b + w + b + "\n" +
        "5️⃣ | " + b + w + b + w + b + w + b + w + "\n" +
        "4️⃣ | " + w + b + w + b + w + b + w + b + "\n" + 
        "3️⃣ | " + b + w + b + w + b + w + b + w + "\n" +
        "2️⃣ | ♟︎♟︎♟︎♟︎♟︎♟︎♟︎♟︎\n" +
        "1️⃣ | ♜♞♝♛♚♝♞♜\n" +
        "///+---------------------\n" + 
        "/// -A-B-C-D-E-F-G-H"
    )
})

test("Coordinates", () => {
    let testCoord1 = "A8";
    expect(board.is_valid_coord(testCoord1)).toBeTruthy();
    expect(board.convert_coord(testCoord1)).toStrictEqual([0, 0]);

    let testCoord2 = "H1";
    expect(board.is_valid_coord(testCoord2)).toBeTruthy();
    expect(board.convert_coord(testCoord2)).toStrictEqual([7, 7]);

    let testCoord3 = "E5";
    expect(board.is_valid_coord(testCoord3)).toBeTruthy();
    expect(board.convert_coord(testCoord3)).toStrictEqual([4, 3]);

    let testCoord4 = "A9";
    expect(board.is_valid_coord(testCoord4)).toBeFalsy();

    let testCoord5 = "P0";
    expect(board.is_valid_coord(testCoord5)).toBeFalsy();

    let testCoord6 = "K6";
    expect(board.is_valid_coord(testCoord6)).toBeFalsy();
});

test("Simple moves", () => {
    function test_move(coord1, coord2) {
        let valid1 = board.is_valid_coord(coord1);
        let valid2 = board.is_valid_coord(coord2);

        let convert1;
        let convert2;
        let cell1;
        let cell2;

        if (valid1) {
            convert1 = board.convert_coord(coord1);
            cell1 = board.board[convert1[1]][convert1[0]];
        }
        if (valid2) {
            convert2 = board.convert_coord(coord2);
            cell2 = board.board[convert2[1]][convert2[0]];
        }

        let valid = board.move(coord1, coord2);
        
        expect(valid).toBe(valid1 && valid2);
        if (valid) {
            if (coord1 != coord2)
                expect(board.board[convert1[1]][convert1[0]]).toBe((convert1[1] + convert1[0] % 2 == 0 ? board.white_space : board.black_space));
            expect(board.board[convert2[1]][convert2[0]]).toBe(cell1);
        }
        else {
            if (valid1)
                expect(board.board[convert1[1]][convert1[0]]).toBe(cell1);
            if (valid2)
                expect(board.board[convert2[1]][convert2[0]]).toBe(cell2);
        }
    }    

    test_move("D2", "D4");
    test_move("E0", "E1");
    test_move("E1", "E1");
    test_move("E4", "K8");
});

test("Place pieces", () => {
    function test_place_piece(coord, piece_id) {
        let valid_coord = board.is_valid_coord(coord);
        let convert;
        let prior_cell;
        if (valid_coord) {
            convert = board.convert_coord(coord);
            prior_cell = board.board[convert[1]][convert[0]];
        }

        let valid_piece = piece_id in board.pieces;

        let valid_placement = board.place_piece(coord, piece_id);
        expect(valid_placement).toBe(valid_coord && valid_piece);
        
        if (valid_placement)
            expect(board.board[convert[1]][convert[0]]).toBe(board.pieces[piece_id]);
        else if (valid_coord)
            expect(board.board[convert[1]][convert[0]]).toBe(prior_cell);
    }

    test_place_piece("A5", "Black Knight");
    test_place_piece("K9", "Orange King");
    test_place_piece("H4", "Blue Tower");
})