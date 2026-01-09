let gameBoard = [];
let usedNumbers = new Set();
let bingoCount = 0;

function initGame() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    gameBoard = [];
    usedNumbers.clear();
    bingoCount = 0;
    updateBingoCounter();
    
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = '25';
        input.addEventListener('input', (e) => validateInput(e, i));
        input.addEventListener('blur', (e) => finalizeInput(e, i));
        
        cell.appendChild(input);
        cell.addEventListener('click', () => toggleCell(i));
        board.appendChild(cell);
        
        gameBoard.push({
            element: cell,
            input: input,
            value: null,
            clicked: false
        });
    }
}

function validateInput(event, index) {
    const value = parseInt(event.target.value);
    const status = document.getElementById('status');
    
    if (isNaN(value) || value < 1 || value > 25) {
        status.textContent = 'Error: Enter numbers between 1-25 only!';
        status.className = 'status error';
        return false;
    }
    
    if (usedNumbers.has(value) && gameBoard[index].value !== value) {
        status.textContent = 'Error: Number already used!';
        status.className = 'status error';
        return false;
    }
    
    status.textContent = 'Good! Click boxes to play';
    status.className = 'status success';
    return true;
}

function finalizeInput(event, index) {
    const value = parseInt(event.target.value);
    
    if (validateInput(event, index)) {
        if (gameBoard[index].value !== null) {
            usedNumbers.delete(gameBoard[index].value);
        }
        gameBoard[index].value = value;
        usedNumbers.add(value);
    } else {
        event.target.value = '';
        if (gameBoard[index].value !== null) {
            usedNumbers.delete(gameBoard[index].value);
            gameBoard[index].value = null;
        }
    }
}

function toggleCell(index) {
    if (gameBoard[index].value === null) {
        document.getElementById('status').textContent = 'Enter a number first!';
        document.getElementById('status').className = 'status error';
        return;
    }
    
    gameBoard[index].clicked = !gameBoard[index].clicked;
    
    if (gameBoard[index].clicked) {
        gameBoard[index].element.classList.add('clicked');
    } else {
        gameBoard[index].element.classList.remove('clicked');
    }
    
    checkWin();
}

function checkWin() {
    // Clear previous winning highlights
    gameBoard.forEach(cell => cell.element.classList.remove('winning'));
    
    let currentBingos = 0;
    
    // Check rows
    for (let row = 0; row < 5; row++) {
        let rowWin = true;
        for (let col = 0; col < 5; col++) {
            if (!gameBoard[row * 5 + col].clicked) {
                rowWin = false;
                break;
            }
        }
        if (rowWin) {
            for (let col = 0; col < 5; col++) {
                gameBoard[row * 5 + col].element.classList.add('winning');
            }
            currentBingos++;
        }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
        let colWin = true;
        for (let row = 0; row < 5; row++) {
            if (!gameBoard[row * 5 + col].clicked) {
                colWin = false;
                break;
            }
        }
        if (colWin) {
            for (let row = 0; row < 5; row++) {
                gameBoard[row * 5 + col].element.classList.add('winning');
            }
            currentBingos++;
        }
    }
    
    // Check diagonal (top-left to bottom-right)
    let diag1Win = true;
    for (let i = 0; i < 5; i++) {
        if (!gameBoard[i * 5 + i].clicked) {
            diag1Win = false;
            break;
        }
    }
    if (diag1Win) {
        for (let i = 0; i < 5; i++) {
            gameBoard[i * 5 + i].element.classList.add('winning');
        }
        currentBingos++;
    }
    
    // Check diagonal (top-right to bottom-left)
    let diag2Win = true;
    for (let i = 0; i < 5; i++) {
        if (!gameBoard[i * 5 + (4 - i)].clicked) {
            diag2Win = false;
            break;
        }
    }
    if (diag2Win) {
        for (let i = 0; i < 5; i++) {
            gameBoard[i * 5 + (4 - i)].element.classList.add('winning');
        }
        currentBingos++;
    }
    
    bingoCount = currentBingos;
    updateBingoCounter();
    
    if (bingoCount > 0) {
        document.getElementById('status').textContent = `BINGO! You have ${bingoCount} bingo(s)!`;
        document.getElementById('status').className = 'status success';
        
        if (bingoCount >= 5) {
            showCelebration();
        }
    }
}

function resetGame() {
    initGame();
    document.getElementById('status').textContent = 'Enter numbers 1-25 in each box';
    document.getElementById('status').className = 'status';
    clearCelebration();
}

function updateBingoCounter() {
    document.getElementById('bingoCount').textContent = bingoCount;
}

function showCelebration() {
    // Create celebration popup
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = '<h2>🎉 AMAZING! 🎉</h2><p>You got 5 BINGOS!</p><p>CONGRATULATIONS!</p>';
    document.body.appendChild(celebration);
    
    // Create fireworks
    createFireworks();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        clearCelebration();
    }, 5000);
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
            
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 100);
    }
}

function clearCelebration() {
    const celebration = document.querySelector('.celebration');
    const fireworks = document.getElementById('fireworks');
    if (celebration) celebration.remove();
    if (fireworks) fireworks.innerHTML = '';
}

// Initialize game when page loads
window.onload = initGame;