const game = new Chess();
let moveHistory = [];
// Set up the board with pieces in the starting position
// and make pieces draggable so users can move them
const board = Chessboard('board1', {
    draggable: true,
    position: 'start',
    onDrop: onDrop, // handle when a piece is dropped
    onMouseoverSquare: onMouseoverSquare, // highlight squares on hover
    onMouseoutSquare: onMouseoutSquare    // clear highlights when mouse leaves
});  


// This runs whenever a piece is dropped on the board
function onDrop(source, target) {
    // Clear any highlighted squares from the last move
    removeGreySquares();

    // Try to make the move — chess.js will tell us if it's valid
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // always promote to a queen (simpler for now)
    });

    // If move is invalid, snap the piece back to where it was
    if (move === null) return 'snapback';

    board.position(game.fen());

    // Tracks and displays move history
    moveHistory.push(move.san); // Standard Algebraic Notation (e.g., e4, Nf3)
    updateMoveHistory();

    if (game.in_checkmate()) {
        alert("Checkmate!");
    } else if (game.in_check()) {
        console.log("Check!");
    }
    
}

function updateMoveHistory() {
    const historyDiv = document.getElementById("history-list");
    if (!historyDiv) return;

    historyDiv.innerHTML = moveHistory
      .map((m, i) => `<span>${i + 1}. ${m}</span>`)
      .join("");
}

// When the user hovers over a square, show all valid destination squares
function onMouseoverSquare(square, piece) {
    const moves = game.moves({
        square: square,
        verbose: true // gives us detailed move objects (not just strings)
    });

    if (moves.length === 0) return;

    // Highlight the square being hovered
    greySquare(square);

    // Highlight each square the piece can legally move to
    moves.forEach(move => greySquare(move.to));
}

// When the mouse leaves a square, remove all highlights
function onMouseoutSquare(square, piece) {
    removeGreySquares();
}

// Highlights a given square with a light/dark grey depending on its color
function greySquare(square) {
    const $square = $('#board1 .square-' + square);
    let background = '#a9a9a9'; // light grey by default

    // Use a darker grey for black squares so it's visible
    if ($square.hasClass('black-3c85d')) {
        background = '#696969';
    }

    $square.css('background', background);
}

// Clears all square highlights from the board
function removeGreySquares() {
    $('#board1 .square-55d63').css('background', '');
}

function resetGame() {
    game.reset();
    board.start();
    moveHistory = [];
    updateMoveHistory();
    document.getElementById("status").innerText = "";
}

function undoMove() {
    game.undo(); // undoes last move
    board.position(game.fen());
    moveHistory.pop();
    updateMoveHistory();
}