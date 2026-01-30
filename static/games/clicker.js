(function() {
    const container = document.getElementById('game-container');
    
    // Create UI elements
    const gameArea = document.createElement('div');
    gameArea.className = 'flex flex-col items-center justify-center w-full h-full text-white';
    
    const title = document.createElement('h2');
    title.innerText = '10 Second Click Challenge';
    title.className = 'text-2xl font-bold mb-4';
    
    const timerDisplay = document.createElement('div');
    timerDisplay.innerText = 'Time: 10';
    timerDisplay.className = 'text-xl mb-2 font-mono text-yellow-400';
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.innerText = 'Clicks: 0';
    scoreDisplay.className = 'text-4xl font-bold mb-8 text-indigo-400';
    
    const clickBtn = document.createElement('button');
    clickBtn.innerText = 'CLICK ME!';
    clickBtn.className = 'px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xl transition-transform active:scale-95 shadow-lg';
    
    const startBtn = document.createElement('button');
    startBtn.innerText = 'Start Game';
    startBtn.className = 'px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold mb-4';
    
    gameArea.appendChild(title);
    gameArea.appendChild(timerDisplay);
    gameArea.appendChild(scoreDisplay);
    gameArea.appendChild(startBtn);
    
    container.innerHTML = '';
    container.appendChild(gameArea);
    
    // Game State
    let clicks = 0;
    let timeLeft = 10;
    let isPlaying = false;
    let timerInterval = null;
    
    // Event Listeners
    startBtn.onclick = startGame;
    clickBtn.onclick = handleClick;
    
    function startGame() {
        clicks = 0;
        timeLeft = 10;
        isPlaying = true;
        
        scoreDisplay.innerText = 'Clicks: 0';
        timerDisplay.innerText = 'Time: 10';
        
        // Switch buttons
        if (gameArea.contains(startBtn)) {
            gameArea.removeChild(startBtn);
        }
        gameArea.appendChild(clickBtn);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = `Time: ${timeLeft}`;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    function handleClick() {
        if (!isPlaying) return;
        clicks++;
        scoreDisplay.innerText = `Clicks: ${clicks}`;
        
        // Add a nice ripple or scale effect
        clickBtn.style.transform = 'scale(0.95)';
        setTimeout(() => clickBtn.style.transform = 'scale(1)', 50);
    }
    
    function endGame() {
        isPlaying = false;
        clearInterval(timerInterval);
        
        gameArea.removeChild(clickBtn);
        gameArea.appendChild(startBtn);
        startBtn.innerText = 'Play Again';
        
        // Submit score using global helper
        if (window.submitGameScore) {
            window.submitGameScore(clicks);
        } else {
            alert(`Game Over! Score: ${clicks}`);
        }
    }
    
    // Expose init function for restart
    window.initGame = function() {
        // Reset state if needed, but startBtn logic handles it
        if (isPlaying) {
            clearInterval(timerInterval);
            isPlaying = false;
        }
        clicks = 0;
        timeLeft = 10;
        scoreDisplay.innerText = 'Clicks: 0';
        timerDisplay.innerText = 'Time: 10';
        if (gameArea.contains(clickBtn)) gameArea.removeChild(clickBtn);
        if (!gameArea.contains(startBtn)) gameArea.appendChild(startBtn);
        startBtn.innerText = 'Start Game';
    };
    
})();