let gameBoard = [];
let nextNumber = 1;
let bingoCount = 0;
let boardFilled = false;
let darkMode = false;

function initGame() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameBoard = [];
    nextNumber = 1;
    bingoCount = 0;
    boardFilled = false;
    updateBingoCounter();

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);

        gameBoard.push({
            element: cell,
            value: null,
            clicked: false
        });
    }
}

function handleClick(index) {
    const cell = gameBoard[index];

    // Phase 2: board is filled, toggle clicked state for gameplay
    if (boardFilled) {
        cell.clicked = !cell.clicked;
        if (cell.clicked) {
            cell.element.classList.add('clicked');
            cell.element.classList.add('pop');
        } else {
            cell.element.classList.remove('clicked');
        }
        setTimeout(() => cell.element.classList.remove('pop'), 300);
        checkWin();
        return;
    }

    // Phase 1: filling numbers
    if (cell.value === null) {
        if (nextNumber > 25) return;
        cell.value = nextNumber;
        cell.element.textContent = nextNumber;
        cell.element.classList.add('bounce-in');
        setTimeout(() => cell.element.classList.remove('bounce-in'), 400);
        nextNumber++;

        if (gameBoard.every(c => c.value !== null)) {
            boardFilled = true;
            document.getElementById('status').textContent = 'Board ready! Click boxes to play';
            document.getElementById('status').className = 'status success';
        } else {
            document.getElementById('status').textContent = `Place number ${nextNumber}`;
            document.getElementById('status').className = 'status';
        }
    } else {
        cell.value = null;
        cell.element.textContent = '';

        const usedNumbers = new Set(gameBoard.filter(c => c.value !== null).map(c => c.value));
        nextNumber = 1;
        while (usedNumbers.has(nextNumber)) nextNumber++;

        document.getElementById('status').textContent = `Place number ${nextNumber}`;
        document.getElementById('status').className = 'status';
    }
}

function shuffleBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameBoard = [];
    bingoCount = 0;
    updateBingoCounter();

    // Generate shuffled 1-25
    const nums = Array.from({length: 25}, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = nums[i];
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);

        gameBoard.push({
            element: cell,
            value: nums[i],
            clicked: false
        });

        // Staggered bounce animation
        setTimeout(() => cell.classList.add('bounce-in'), i * 30);
        setTimeout(() => cell.classList.remove('bounce-in'), i * 30 + 400);
    }

    nextNumber = 26;
    boardFilled = true;
    document.getElementById('status').textContent = 'Board ready! Click boxes to play';
    document.getElementById('status').className = 'status success';
}

function checkWin() {
    gameBoard.forEach(cell => cell.element.classList.remove('winning'));

    let currentBingos = 0;

    for (let row = 0; row < 5; row++) {
        if ([0,1,2,3,4].every(col => gameBoard[row * 5 + col].clicked)) {
            for (let col = 0; col < 5; col++) gameBoard[row * 5 + col].element.classList.add('winning');
            currentBingos++;
        }
    }

    for (let col = 0; col < 5; col++) {
        if ([0,1,2,3,4].every(row => gameBoard[row * 5 + col].clicked)) {
            for (let row = 0; row < 5; row++) gameBoard[row * 5 + col].element.classList.add('winning');
            currentBingos++;
        }
    }

    if ([0,1,2,3,4].every(i => gameBoard[i * 5 + i].clicked)) {
        for (let i = 0; i < 5; i++) gameBoard[i * 5 + i].element.classList.add('winning');
        currentBingos++;
    }
    if ([0,1,2,3,4].every(i => gameBoard[i * 5 + (4 - i)].clicked)) {
        for (let i = 0; i < 5; i++) gameBoard[i * 5 + (4 - i)].element.classList.add('winning');
        currentBingos++;
    }

    bingoCount = currentBingos;
    updateBingoCounter();

    if (bingoCount > 0) {
        document.getElementById('status').textContent = `BINGO! You have ${bingoCount} bingo(s)!`;
        document.getElementById('status').className = 'status success';
        if (bingoCount >= 5) showCelebration();
    }
}

function resetGame() {
    initGame();
    document.getElementById('status').textContent = 'Click boxes to place numbers 1-25';
    document.getElementById('status').className = 'status';
    clearCelebration();
}

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    document.querySelector('.theme-btn').textContent = darkMode ? '☀️' : '🌙';
}

function updateBingoCounter() {
    document.getElementById('bingoCount').textContent = bingoCount;
}

function showCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = '<h2>🎉 AMAZING! 🎉</h2><p>You got 5 BINGOS!</p><p>CONGRATULATIONS!</p>';
    document.body.appendChild(celebration);
    createFireworks();
    setTimeout(() => clearCelebration(), 5000);
}

function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            fireworksContainer.appendChild(firework);
            setTimeout(() => firework.remove(), 1000);
        }, i * 100);
    }
}

function clearCelebration() {
    const celebration = document.querySelector('.celebration');
    const fireworks = document.getElementById('fireworks');
    if (celebration) celebration.remove();
    if (fireworks) fireworks.innerHTML = '';
}

window.onload = initGame;
