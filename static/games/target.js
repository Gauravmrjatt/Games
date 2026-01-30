(function() {
    const container = document.getElementById('game-container');
    
    // UI Setup
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full text-white relative overflow-hidden">
            <div id="game-ui" class="text-center z-10 pointer-events-none">
                <h2 class="text-2xl font-bold mb-4">Target Practice</h2>
                <div class="flex gap-8 mb-4">
                    <div class="text-xl font-mono text-yellow-400">Time: <span id="time">30</span></div>
                    <div class="text-xl font-mono text-indigo-400">Score: <span id="score">0</span></div>
                </div>
            </div>
            <div id="target-area" class="absolute inset-0 top-16 w-full h-full"></div>
            <button id="start-btn" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold z-20">Start Game</button>
        </div>
    `;

    const startBtn = document.getElementById('start-btn');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const targetArea = document.getElementById('target-area');
    
    let score = 0;
    let timeLeft = 30;
    let isPlaying = false;
    let timerInterval = null;
    let spawnInterval = null;

    startBtn.onclick = startGame;

    function startGame() {
        score = 0;
        timeLeft = 30;
        isPlaying = true;
        updateDisplay();
        
        startBtn.classList.add('hidden');
        targetArea.innerHTML = '';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) endGame();
        }, 1000);

        spawnTarget();
    }

    function spawnTarget() {
        if (!isPlaying) return;

        const target = document.createElement('div');
        const size = Math.random() * 40 + 30; // 30-70px
        const maxLeft = targetArea.clientWidth - size;
        const maxTop = targetArea.clientHeight - size - 20; // -20 padding

        target.style.width = `${size}px`;
        target.style.height = `${size}px`;
        target.style.position = 'absolute';
        target.style.left = `${Math.random() * maxLeft}px`;
        target.style.top = `${Math.random() * maxTop}px`;
        target.style.borderRadius = '50%';
        target.style.backgroundColor = '#f87171'; // Red-400
        target.style.border = '4px solid white';
        target.style.cursor = 'pointer';
        target.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
        target.style.transition = 'transform 0.1s';
        
        // Target rings
        target.innerHTML = `
            <div class="w-full h-full rounded-full border-4 border-white opacity-50 flex items-center justify-center">
                <div class="w-1/2 h-1/2 bg-white rounded-full"></div>
            </div>
        `;

        target.onmousedown = (e) => {
            if (!isPlaying) return;
            
            // Create particles at click position
            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            createParticles(e.clientX, e.clientY);
            
            // Play sound effect (optional/future)
            
            score++;
            updateDisplay();
            target.remove();
            spawnTarget();
        };

        targetArea.appendChild(target);
    }

    function createParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = '#fbbf24'; // Yellow
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '100';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 50 + 20;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 500,
                easing: 'cubic-bezier(0, .9, .57, 1)',
            }).onfinish = () => particle.remove();
            
            document.body.appendChild(particle);
        }
    }

    function updateDisplay() {
        timeDisplay.innerText = timeLeft;
        scoreDisplay.innerText = score;
    }

    function endGame() {
        isPlaying = false;
        clearInterval(timerInterval);
        targetArea.innerHTML = '';
        
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
            isPlaying = false;
        }
        score = 0;
        timeLeft = 30;
        updateDisplay();
        targetArea.innerHTML = '';
        startBtn.innerText = 'Start Game';
        startBtn.classList.remove('hidden');
    };
})();