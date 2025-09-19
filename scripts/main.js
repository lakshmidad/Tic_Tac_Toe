document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const statusMessage = document.querySelector('.status-message');
    const restartButton = document.querySelector('.restart-button');
    const playerScoreElem = document.getElementById('player-score');
    const computerScoreElem = document.getElementById('computer-score');
    let playerScore = 0;
    let computerScore = 0;
    let board = Array(9).fill('');
    let isPlayerTurn = true; // true: player, false: computer

    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    let loggedIn = false;

    function startGame() {
        if (!loggedIn) {
            showLogin();
            return;
        }
        board = Array(9).fill('');
        isPlayerTurn = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner', 'x', 'o');
            cell.addEventListener('click', handleCellClick, { once: true });
        });
        statusMessage.textContent = "Your turn!";
    }

    function handleCellClick(e) {
        const idx = Array.from(cells).indexOf(e.target);
        if (board[idx] !== '' || !isPlayerTurn) return;
        board[idx] = 'X';
        e.target.textContent = 'X';
        e.target.classList.add('x');
        if (checkWin('X')) {
            endGame('You win!');
            return;
        } else if (board.every(cell => cell !== '')) {
            endGame('Draw!');
            return;
        }
        isPlayerTurn = false;
        statusMessage.textContent = "Computer's turn...";
        setTimeout(computerMove, 700);
    }

    function computerMove() {
        const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
        if (emptyIndices.length === 0) return;
        const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        board[idx] = 'O';
        cells[idx].textContent = 'O';
        cells[idx].classList.add('o');
        if (checkWin('O')) {
            endGame('Computer wins!');
            return;
        } else if (board.every(cell => cell !== '')) {
            endGame('Draw!');
            return;
        }
        isPlayerTurn = true;
        statusMessage.textContent = "Your turn!";
    }

    function checkWin(player) {
        const winCombos = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        return winCombos.some(combo => {
            if (combo.every(i => board[i] === player)) {
                combo.forEach(i => cells[i].classList.add('winner'));
                return true;
            }
            return false;
        });
    }

    function endGame(message) {
        statusMessage.textContent = message;
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
        if (message === 'You win!') {
            playerScore++;
            playerScoreElem.textContent = playerScore;
        } else if (message === 'Computer wins!') {
            computerScore++;
            computerScoreElem.textContent = computerScore;
        }
    }

    function showLogin() {
        loginModal.style.display = 'flex';
        document.querySelector('.game-container').style.filter = 'blur(2px)';
    }

    function hideLogin() {
        loginModal.style.display = 'none';
        document.querySelector('.game-container').style.filter = 'none';
    }

    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            loggedIn = true;
            hideLogin();
            startGame();
        } else {
            usernameInput.style.borderColor = 'red';
        }
    });

    restartButton.addEventListener('click', startGame);

    // Show login on page load
    showLogin();
});