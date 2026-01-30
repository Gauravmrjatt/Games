(function() {
    const container = document.getElementById('game-container');
    
    // UI Setup
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full text-white p-4">
            <h2 class="text-2xl font-bold mb-4">Math Sprint</h2>
            <div class="flex gap-8 mb-6">
                <div class="text-xl font-mono text-yellow-400">Time: <span id="time">60</span></div>
                <div class="text-xl font-mono text-indigo-400">Score: <span id="score">0</span></div>
            </div>
            
            <div id="game-area" class="flex flex-col items-center w-full max-w-sm hidden">
                <div class="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 w-full text-center mb-6">
                    <div id="problem" class="text-4xl font-bold mb-2">2 + 2 = ?</div>
                </div>
                
                <input type="number" id="answer-input" class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white text-xl text-center focus:outline-none focus:border-indigo-500 mb-4" placeholder="Type answer...">
                
                <div class="flex gap-4 w-full">
                    <button id="skip-btn" class="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded font-bold">Skip (-1)</button>
                    <button id="submit-btn" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 rounded font-bold">Enter</button>
                </div>
            </div>
            
            <div id="start-screen" class="text-center">
                <p class="mb-4 text-gray-300">Solve as many problems as you can in 60 seconds!</p>
                <button id="start-btn" class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-lg">Start Game</button>
            </div>
        </div>
    `;

    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const gameArea = document.getElementById('game-area');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const problemDisplay = document.getElementById('problem');
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const skipBtn = document.getElementById('skip-btn');
    
    let score = 0;
    let timeLeft = 60;
    let isPlaying = false;
    let timerInterval = null;
    let currentAnswer = 0;

    startBtn.onclick = startGame;
    submitBtn.onclick = checkAnswer;
    skipBtn.onclick = skipProblem;

    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    function generateProblem() {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b;
        
        // Difficulty scaling could go here
        if (op === '*') {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            currentAnswer = a * b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * a); // Ensure positive result
            currentAnswer = a - b;
        } else {
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            currentAnswer = a + b;
        }
        
        problemDisplay.innerText = `${a} ${op} ${b} = ?`;
        answerInput.value = '';
        answerInput.focus();
    }

    function startGame() {
        score = 0;
        timeLeft = 60;
        isPlaying = true;
        updateDisplay();
        
        startScreen.classList.add('hidden');
        gameArea.classList.remove('hidden');
        
        generateProblem();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    function checkAnswer() {
        if (!isPlaying) return;
        
        const val = parseInt(answerInput.value);
        if (val === currentAnswer) {
            score++;
            // Visual feedback correct
            answerInput.classList.add('bg-green-900');
            setTimeout(() => answerInput.classList.remove('bg-green-900'), 200);
        } else {
            // Wrong answer penalty? Or just ignore? 
            // Let's deduct time or score? 
            // Just don't advance score, maybe flash red
            answerInput.classList.add('bg-red-900');
            setTimeout(() => answerInput.classList.remove('bg-red-900'), 200);
            return; // Don't generate new problem until correct or skipped? 
            // Actually, for speed, usually you just move on or retry. Let's force retry.
        }
        
        updateDisplay();
        generateProblem();
    }

    function skipProblem() {
        if (!isPlaying) return;
        score = Math.max(0, score - 1);
        updateDisplay();
        generateProblem();
    }

    function updateDisplay() {
        timeDisplay.innerText = timeLeft;
        scoreDisplay.innerText = score;
    }

    function endGame() {
        isPlaying = false;
        clearInterval(timerInterval);
        
        gameArea.classList.add('hidden');
        startScreen.classList.remove('hidden');
        startBtn.innerText = 'Play Again';
        
        if (window.submitGameScore) {
            window.submitGameScore(score);
        } else {
            alert(`Game Over! Score: ${score}`);
        }
    }

    window.initGame = function() {
        if (isPlaying) {
            clearInterval(timerInterval);
            isPlaying = false;
        }
        score = 0;
        timeLeft = 60;
        updateDisplay();
        gameArea.classList.add('hidden');
        startScreen.classList.remove('hidden');
        startBtn.innerText = 'Start Game';
    };
})();