(function() {
    const container = document.getElementById('game-container');
    
    // UI Setup
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full text-white">
            <h2 class="text-2xl font-bold mb-4">Whack-a-Mole</h2>
            <div class="flex gap-8 mb-4">
                <div class="text-xl font-mono text-yellow-400">Time: <span id="time">30</span></div>
                <div class="text-xl font-mono text-indigo-400">Score: <span id="score">0</span></div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                ${Array(9).fill(0).map((_, i) => `
                    <div id="hole-${i}" class="w-20 h-20 bg-gray-900 rounded-full relative overflow-hidden border-b-4 border-gray-700 shadow-inner cursor-pointer">
                        <div class="mole w-16 h-16 bg-amber-600 rounded-t-full absolute -bottom-16 left-2 transition-all duration-100 flex items-center justify-center">
                            <div class="w-2 h-2 bg-black rounded-full mr-2 mb-2"></div>
                            <div class="w-2 h-2 bg-black rounded-full ml-2 mb-2"></div>
                            <div class="w-4 h-2 bg-pink-300 rounded-full absolute bottom-4"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <button id="start-btn" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold">Start Game</button>
        </div>
    `;

    const startBtn = document.getElementById('start-btn');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const holes = Array.from(document.querySelectorAll('[id^="hole-"]'));
    
    let score = 0;
    let timeLeft = 30;
    let isPlaying = false;
    let timerInterval = null;
    let moleTimeout = null;
    let lastHole;

    startBtn.onclick = startGame;

    // Add click listeners to holes
    holes.forEach(hole => {
        hole.addEventListener('mousedown', () => {
            if (!isPlaying) return;
            const mole = hole.querySelector('.mole');
            if (mole.classList.contains('bottom-0')) { // If mole is up
                score++;
                scoreDisplay.innerText = score;
                mole.classList.remove('bottom-0');
                mole.classList.add('-bottom-16');
                mole.classList.add('bg-red-500'); // Hit effect
                setTimeout(() => mole.classList.remove('bg-red-500'), 200);
            }
        });
    });

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) return randomHole(holes);
        lastHole = hole;
        return hole;
    }

    function peep() {
        if (!isPlaying) return;
        
        const time = randomTime(400, 1000); // Speed
        const hole = randomHole(holes);
        const mole = hole.querySelector('.mole');
        
        mole.classList.remove('-bottom-16');
        mole.classList.add('bottom-0');
        
        moleTimeout = setTimeout(() => {
            mole.classList.remove('bottom-0');
            mole.classList.add('-bottom-16');
            if (isPlaying) peep();
        }, time);
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        scoreDisplay.innerText = 0;
        timeDisplay.innerText = 30;
        isPlaying = true;
        startBtn.classList.add('hidden');
        
        peep();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.innerText = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        isPlaying = false;
        clearInterval(timerInterval);
        clearTimeout(moleTimeout);
        
        startBtn.innerText = 'Play Again';
        startBtn.classList.remove('hidden');
        
        if (window.submitGameScore) {
            window.submitGameScore(score);
        } else {
            alert(`Game Over! Score: ${score}`);
        }
    }

    window.initGame = function() {
        if (isPlaying) {
            clearInterval(timerInterval);
            clearTimeout(moleTimeout);
            isPlaying = false;
        }
        score = 0;
        timeLeft = 30;
        scoreDisplay.innerText = 0;
        timeDisplay.innerText = 30;
        startBtn.innerText = 'Start Game';
        startBtn.classList.remove('hidden');
        
        // Reset moles
        holes.forEach(h => {
            const m = h.querySelector('.mole');
            m.classList.remove('bottom-0');
            m.classList.add('-bottom-16');
        });
    };
})();