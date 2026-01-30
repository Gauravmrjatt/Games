(function() {
    const container = document.getElementById('game-container');
    
    // UI Setup
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center w-full h-full text-white relative">
            <h2 class="text-2xl font-bold mb-4">Simon Says</h2>
            <div class="text-xl font-mono text-indigo-400 mb-6">Level: <span id="level">1</span></div>
            
            <div class="grid grid-cols-2 gap-4 mb-8">
                <div id="btn-0" class="w-24 h-24 bg-red-800 rounded-tl-full cursor-pointer hover:bg-red-700 transition-colors opacity-80 border-4 border-transparent"></div>
                <div id="btn-1" class="w-24 h-24 bg-green-800 rounded-tr-full cursor-pointer hover:bg-green-700 transition-colors opacity-80 border-4 border-transparent"></div>
                <div id="btn-2" class="w-24 h-24 bg-blue-800 rounded-bl-full cursor-pointer hover:bg-blue-700 transition-colors opacity-80 border-4 border-transparent"></div>
                <div id="btn-3" class="w-24 h-24 bg-yellow-800 rounded-br-full cursor-pointer hover:bg-yellow-700 transition-colors opacity-80 border-4 border-transparent"></div>
            </div>
            
            <button id="start-btn" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold">Start Game</button>
            <p id="status" class="mt-4 text-gray-400 h-6">Watch the sequence...</p>
        </div>
    `;

    const startBtn = document.getElementById('start-btn');
    const levelDisplay = document.getElementById('level');
    const statusDisplay = document.getElementById('status');
    const buttons = [
        document.getElementById('btn-0'),
        document.getElementById('btn-1'),
        document.getElementById('btn-2'),
        document.getElementById('btn-3')
    ];
    
    // Colors for activation
    const activeColors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500'];
    const baseColors = ['bg-red-800', 'bg-green-800', 'bg-blue-800', 'bg-yellow-800'];

    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let isPlaying = false;
    let isPlayerTurn = false;

    startBtn.onclick = startGame;

    buttons.forEach((btn, index) => {
        btn.onclick = () => handleInput(index);
    });

    function startGame() {
        sequence = [];
        playerSequence = [];
        level = 1;
        isPlaying = true;
        levelDisplay.innerText = level;
        startBtn.classList.add('hidden');
        nextRound();
    }

    function nextRound() {
        playerSequence = [];
        sequence.push(Math.floor(Math.random() * 4));
        levelDisplay.innerText = sequence.length;
        statusDisplay.innerText = "Watch carefully...";
        isPlayerTurn = false;
        
        playSequence();
    }

    async function playSequence() {
        // Disable interaction
        container.style.pointerEvents = 'none';
        
        await new Promise(r => setTimeout(r, 1000));

        for (let i = 0; i < sequence.length; i++) {
            await flashButton(sequence[i]);
            await new Promise(r => setTimeout(r, 300)); // Gap between flashes
        }

        container.style.pointerEvents = 'auto';
        isPlayerTurn = true;
        statusDisplay.innerText = "Your turn!";
    }

    async function flashButton(index) {
        const btn = buttons[index];
        btn.classList.remove(baseColors[index]);
        btn.classList.add(activeColors[index]);
        btn.classList.add('scale-95'); // Press effect
        
        // Sound could go here
        
        await new Promise(r => setTimeout(r, 400));
        
        btn.classList.remove(activeColors[index]);
        btn.classList.add(baseColors[index]);
        btn.classList.remove('scale-95');
    }

    function handleInput(index) {
        if (!isPlaying || !isPlayerTurn) return;

        flashButton(index); // Visual feedback
        playerSequence.push(index);

        // Check correct
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            gameOver();
            return;
        }

        // Check if round complete
        if (playerSequence.length === sequence.length) {
            isPlayerTurn = false;
            statusDisplay.innerText = "Correct! Get ready...";
            setTimeout(nextRound, 1000);
        }
    }

    function gameOver() {
        isPlaying = false;
        statusDisplay.innerText = "Game Over!";
        startBtn.innerText = 'Play Again';
        startBtn.classList.remove('hidden');
        
        const finalScore = sequence.length - 1; // Score is completed levels
        
        if (window.submitGameScore) {
            window.submitGameScore(finalScore);
        } else {
            alert(`Game Over! Score: ${finalScore}`);
        }
    }

    window.initGame = function() {
        isPlaying = false;
        sequence = [];
        playerSequence = [];
        level = 1;
        levelDisplay.innerText = 1;
        statusDisplay.innerText = "Press Start";
        startBtn.classList.remove('hidden');
        startBtn.innerText = 'Start Game';
    };
})();