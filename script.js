let currentPage = 1;
let musicStarted = false;
let audioContext = null;
let musicGain = null;
let melodyInterval = null;
let giftOpened = [];
let totalGifts = 7;
let currentRiddle = 0;
let riddleTimer = null;
let totalCorrect = 0;
let noContextIndex = 0;
let userName = '';
let rejectStep = 1;
let quizAnswers = {};

// Puzzle variables
let moves = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;
let currentImgSrc = 'https://picsum.photos/400/400?random=1';

const noContextMessages = [
    "Wait a minute.....", "Did I forget something.....", "Give me a moment.....",
    "Is it Your Birthday 🎂 today.....", "Really.....", "Sorry I didn't wish you earlier....."
];

const giftMessages = [
    (count) => `You have answered ${count} questions correctly.`,
    (option) => `I will send you 5 ${option} 🍫 for each correct question.`,
    (allCorrect) => allCorrect ? "You are damn smart 🤓" : "But still, you are too slow 🐢😂"
];

const happyBirthdayNotes = [
    523.25, 523.25, 587.33, 523.25, 698.46, 659.25,
    523.25, 523.25, 587.33, 523.25, 783.99, 698.46,
    523.25, 523.25, 1046.50, 880.00, 698.46, 659.25, 587.33,
    1046.50, 1046.50, 880.00, 698.46, 783.99, 698.46
];

function startHappyBirthdayMusic() {
    if (musicStarted) return;
    musicStarted = true;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        musicGain = audioContext.createGain();
        musicGain.connect(audioContext.destination);
        musicGain.gain.setValueAtTime(0.25, audioContext.currentTime);
        playHappyBirthday();
        melodyInterval = setInterval(playHappyBirthday, 8000);
    } catch(e) { console.log("Audio error:", e); }
}

function playHappyBirthday() {
    if (!audioContext) return;
    let time = audioContext.currentTime;
    happyBirthdayNotes.forEach((note, index) => {
        const noteTime = time + (index * 0.35);
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(musicGain);
        osc.frequency.setValueAtTime(note, noteTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
    });
}

function playCrackersSound() {
    if (!audioContext) return;
    musicGain.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 2);
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.setValueAtTime(200 + Math.random() * 1000, audioContext.currentTime);
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            osc.start();
            osc.stop(audioContext.currentTime + 0.1);
        }, i * 100);
    }
}

function playPopSound() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.1;
    osc.start();
    osc.stop(audioContext.currentTime + 0.1);
}

function playGiftSound() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = 600;
    gain.gain.value = 0.15;
    osc.start();
    osc.stop(audioContext.currentTime + 0.2);
}

function playSuccessSound() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = 1046.50;
    gain.gain.value = 0.2;
    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
}

function toggleMusic() {
    if (bgMusic) {
        if (musicEnabled) { bgMusic.play(); }
        else { bgMusic.pause(); }
    }
}

function showPage(pageNum) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageNum}`);
    if (targetPage) targetPage.classList.add('active');
    currentPage = pageNum;
    
    if (pageNum === 12) initBalloons();
    if (pageNum === 14) startRibbons('ribbons-container-14');
    if (pageNum === 17) initPuzzlePage();
    if (pageNum === 18) startCakeFalling();
}

function nextPage() {
    if (currentPage < 18) showPage(currentPage + 1);
}

// Name validation
document.getElementById('next-1').addEventListener('click', function() {
    const name = document.getElementById('name-input').value.trim();
    if (!name) { alert('Please enter your name'); return; }
    userName = name;
    if (userName.toLowerCase() === 'shweta') {
        startHappyBirthdayMusic();
        showPage(2);
    } else {
        document.getElementById('rejectNameMsg').innerHTML = `Welcome ${userName}`;
        document.getElementById('page-1').classList.remove('active');
        document.getElementById('reject1').classList.add('active');
    }
});

document.getElementById('next-2').addEventListener('click', function() {
    const year = document.getElementById('year-input').value;
    if (year.trim()) nextPage();
    else alert('Please enter your birth year!');
});

document.getElementById('next-3').addEventListener('click', nextPage);

// Options for pages 4-11
for (let i = 4; i <= 11; i++) {
    document.querySelectorAll(`#page-${i} .option`).forEach(option => {
        option.addEventListener('click', function() {
            quizAnswers[`page-${i}`] = this.innerText;
            document.querySelectorAll(`#page-${i} .option`).forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            setTimeout(nextPage, 500);
        });
    });
}

document.getElementById('next-13').addEventListener('click', nextPage);
document.getElementById('heart-yes-14').addEventListener('click', function() { nextPage(); });
document.getElementById('next-15').addEventListener('click', nextPage);

// No Context Messages
let ncIndex = 0;
document.getElementById('nextNoContext').addEventListener('click', function() {
    ncIndex++;
    if (ncIndex < noContextMessages.length) {
        document.getElementById('noContextMessage').innerText = noContextMessages[ncIndex];
    } else {
        nextPage();
    }
});

// Gift Boxes
function initBalloons() {
    const container = document.getElementById('balloon-random-container');
    container.innerHTML = '';
    giftOpened = [];
    let foodChoice = quizAnswers['page-11'] || 'Kitkat';
    
    for (let i = 0; i < totalGifts; i++) {
        const giftDiv = document.createElement('div');
        giftDiv.className = 'balloon-gift-item';
        giftDiv.innerHTML = `<div class="balloon-icon">🎈</div><div class="gift-icon">🎁</div>`;
        giftDiv.onclick = () => openGiftBox(i, foodChoice);
        container.appendChild(giftDiv);
    }
}

function openGiftBox(index, foodChoice) {
    if (giftOpened.includes(index)) return;
    playGiftSound();
    giftOpened.push(index);
    const msgDiv = document.getElementById('balloon-message');
    document.getElementById('popped-count').innerText = giftOpened.length;
    
    let message = '';
    if (giftOpened.length === 1) message = giftMessages[0](3);
    else if (giftOpened.length === 2) message = giftMessages[1](foodChoice);
    else if (giftOpened.length === 3) message = giftMessages[2](true);
    
    if (message) msgDiv.innerHTML = `<p>🎁 ${message}</p>`;
    if (giftOpened.length >= 3) setTimeout(() => nextPage(), 1000);
}

function startRibbons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const ribbon = document.createElement('div');
        ribbon.className = 'ribbon';
        ribbon.style.left = Math.random() * 100 + '%';
        ribbon.style.animationDuration = Math.random() * 4 + 3 + 's';
        ribbon.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(ribbon);
    }
}

// ==================== YOUR PUZZLE CODE ====================
function initPuzzlePage() {
    const imageLoader = document.getElementById('imageLoader');
    const board = document.getElementById('board');
    const pool = document.getElementById('pool');
    const hintBtn = document.getElementById('hintBtn');
    const hintOverlay = document.getElementById('hint-overlay');
    const moveCountLabel = document.getElementById('moveCount');
    const timerLabel = document.getElementById('timer');
    const winModal = document.getElementById('win-modal');
    const mask = document.getElementById('mask');
    const winDetails = document.getElementById('win-details');
    const reloadBtn = document.getElementById('reloadBtn');
    const continueBtn = document.getElementById('continuePuzzleBtn');

    moves = 0;
    seconds = 0;
    gameStarted = false;
    if (moveCountLabel) moveCountLabel.textContent = moves;
    if (timerLabel) timerLabel.textContent = "00:00";
    if (timerInterval) clearInterval(timerInterval);
    if (winModal) winModal.style.display = 'none';
    if (mask) mask.style.display = 'none';

    if (board) {
        Array.from(board.children).forEach(child => { if (child !== hintOverlay) child.remove(); });
    }
    if (pool) pool.innerHTML = '';
    if (hintOverlay) hintOverlay.style.backgroundImage = `url(${currentImgSrc})`;

    for (let i = 0; i < 16; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        slot.addEventListener('dragover', e => { e.preventDefault(); slot.classList.add('drag-over'); });
        slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
        slot.addEventListener('drop', (e) => handleDrop(e, board, pool, updateMoves, checkWin, moveCountLabel, timerLabel, winModal, mask, winDetails));
        if (board) board.appendChild(slot);
    }

    if (pool) {
        pool.addEventListener('dragover', e => e.preventDefault());
        pool.addEventListener('drop', (e) => handleDrop(e, board, pool, updateMoves, checkWin, moveCountLabel, timerLabel, winModal, mask, winDetails));
    }

    let pieces = [];
    for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.id = `piece-${i}`;
        piece.draggable = true;
        piece.dataset.index = i;
        piece.style.backgroundImage = `url(${currentImgSrc})`;
        piece.style.backgroundSize = '400px 400px';
        piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
        piece.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.id);
            if (!gameStarted) startTimer(timerInterval, timerLabel, gameStarted);
            gameStarted = true;
        });
        pieces.push(piece);
    }
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(p => pool.appendChild(p));

    function updateMoves() { moves++; if (moveCountLabel) moveCountLabel.textContent = moves; }
    
    function checkWin() {
        const slots = board.querySelectorAll('.slot');
        let accurateCount = 0;
        slots.forEach(slot => {
            if (slot.children.length > 0 && slot.dataset.index === slot.children[0].dataset.index) accurateCount++;
        });
        if (accurateCount === 16) {
            if (timerInterval) clearInterval(timerInterval);
            if (winDetails) winDetails.textContent = `Completed in ${moves} moves and ${timerLabel.textContent}!`;
            if (winModal) winModal.style.display = 'block';
            if (mask) mask.style.display = 'block';
        }
    }

    if (hintBtn) {
        hintBtn.onmousedown = () => { if (hintOverlay) hintOverlay.style.display = 'block'; };
        hintBtn.onmouseup = () => { if (hintOverlay) hintOverlay.style.display = 'none'; };
        hintBtn.onmouseleave = () => { if (hintOverlay) hintOverlay.style.display = 'none'; };
    }

    if (reloadBtn) reloadBtn.onclick = () => initPuzzlePage();
    if (continueBtn) continueBtn.onclick = () => { nextPage(); };
    if (imageLoader) imageLoader.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = function(event) { currentImgSrc = event.target.result; initPuzzlePage(); };
        reader.readAsDataURL(e.target.files[0]);
    };
}

function handleDrop(e, board, pool, updateMoves, checkWin, moveCountLabel, timerLabel, winModal, mask, winDetails) {
    e.preventDefault();
    const slot = e.currentTarget;
    if (slot) slot.classList.remove('drag-over');
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    if (!piece) return;
    if (slot.classList && slot.classList.contains('slot') && slot.children.length === 0) {
        slot.appendChild(piece);
        updateMoves();
    } else if (slot.id === 'pool') {
        slot.appendChild(piece);
        updateMoves();
    }
    checkWin();
}

function startTimer(timerInterval, timerLabel, gameStarted) {
    if (gameStarted) return;
    gameStarted = true;
    timerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        if (timerLabel) timerLabel.textContent = `${mins}:${secs}`;
    }, 1000);
}

// Cake Animation
function startCakeFalling() {
    const cakeDiv = document.getElementById('cakeArea');
    const cakeMsg = document.getElementById('cakeMsg');
    if (!cakeDiv) return;
    let layers = 0;
    const interval = setInterval(() => {
        const cake = document.createElement('div');
        cake.className = 'falling-cake-layer';
        cake.textContent = '🎂';
        cakeDiv.appendChild(cake);
        setTimeout(() => cake.remove(), 1400);
        layers++;
        if (layers >= 6) {
            clearInterval(interval);
            if (cakeMsg) cakeMsg.innerHTML = "Happy Birthday 🎂 Shwetaaaaaa Sister";
            playCrackersSound();
        }
    }, 800);
}

// Stars
function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random();
        if (size < 0.33) star.classList.add('large');
        else if (size < 0.66) star.classList.add('medium');
        else star.classList.add('small');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        container.appendChild(star);
    }
}
createStars();

// Initialize
showPage(1);

