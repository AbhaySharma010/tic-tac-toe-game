const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;

// Winning combinations
const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[cellIndex] !== '' || !isGameActive) {
        return;
    }

    updateCell(clickedCell, cellIndex);
    checkResult();

    // If playing against AI and game is still active
    if (isGameActive && currentPlayer === 'O') {
        // Simple AI: Choose a random empty cell
        aiMove();
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusElement.textContent = `Player ${currentPlayer} has won!`;
        isGameActive = false;
        highlightWinningCells(condition);
        return;
    }

    if (!board.includes('')) {
        statusElement.textContent = `Game ended in a draw!`;
        isGameActive = false;
        return;
    }

    switchPlayer();
}

function highlightWinningCells(condition) {
    condition.forEach(index => {
        cells[index].style.backgroundColor = '#90ee90'; // Light green
    });
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#fff';
    });
}

restartButton.addEventListener('click', restartGame);

// Simple AI implementation
function aiMove() {
    const emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return;

    // Random AI
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const aiCell = document.querySelector(`.cell[data-index='${randomIndex}']`);
    setTimeout(() => { // Delay for better UX
        updateCell(aiCell, randomIndex);
        checkResult();
    }, 500);
}

// Uncomment the following to use the Minimax AI instead of the simple AI and comment again according to your need


function aiMove() {
    const bestMove = minimax(board, 'O').index;
    const aiCell = document.querySelector(`.cell[data-index='${bestMove}']`);
    setTimeout(() => {
        updateCell(aiCell, bestMove);
        checkResult();
    }, 500);
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (checkWin(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWin(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(boardState, player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
            return true;
        }
    }
    return false;
}
