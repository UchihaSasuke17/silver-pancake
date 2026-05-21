let currentPage = 1;
let musicStarted = false;
let audioContext = null;
let musicGain = null;
let melodyInterval = null;
let giftOpened = [];
let totalGifts = 7;
let anotherAnswers = [];
let foodAnswers = [];
let noContextIndex = 0;
let userName = '';
let rejectStep = 1;
let loopingInterval = null;
let currentLoopStep = 0;

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
    const music = document.getElementById('bgMusic');
    const icon = document.querySelector('.music-icon');
    if (music.paused) { music.play(); if(icon) icon.textContent = '🔊'; }
    else { music.pause(); if(icon) icon.textContent = '🔇'; }
}

function showPage(pageNum) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageNum}`);
    if (targetPage) targetPage.classList.add('active');
    currentPage = pageNum;
    if (pageNum === 19) initBalloons();
    if (pageNum === 23) startLoopingQuestion1();
    if (pageNum === 24) startLoopingQuestion2();
    if (pageNum === 25) startCakeFalling();
}

function nextPage() {
    if (currentPage < 25) showPage(currentPage + 1);
}

// ==================== REJECTION FUNCTIONS ====================
function goToReject1() {
    document.getElementById('page-1').classList.remove('active');
    document.getElementById('reject1').classList.add('active');
    currentPage = 'reject1';
}

function nextReject() {
    rejectStep++;
    if (rejectStep === 2) {
        document.getElementById('reject1').classList.remove('active');
        document.getElementById('reject2').classList.add('active');
        currentPage = 'reject2';
    } else if (rejectStep === 3) {
        document.getElementById('reject2').classList.remove('active');
        document.getElementById('reject3').classList.add('active');
        currentPage = 'reject3';
    } else if (rejectStep === 4) {
        closeSite();
    }
}

function closeSite() {
    document.body.innerHTML = '<div style="text-align:center; padding:60px; color:white;"><h1>Goodbye!</h1></div>';
}

// ==================== LOOPING QUESTION 1 ====================
function startLoopingQuestion1() {
    currentLoopStep = 0;
    if (loopingInterval) clearInterval(loopingInterval);
    
    function updateOptions() {
        let optionText = '';
        const repeatCount = Math.pow(2, currentLoopStep);
        for (let i = 0; i < repeatCount; i++) {
            optionText += 'Tanu\'s Heart ';
        }
        const optionDiv = document.getElementById('looping-option-1');
        if (optionDiv) optionDiv.innerHTML = optionText.trim();
        currentLoopStep++;
        if (currentLoopStep > 4) currentLoopStep = 0;
    }
    
    updateOptions();
    loopingInterval = setInterval(updateOptions, 1000);
    
    const selectBtn = document.getElementById('looping-answer-1');
    if (selectBtn) {
        selectBtn.onclick = () => {
            clearInterval(loopingInterval);
            nextPage();
        };
    }
}

// ==================== LOOPING QUESTION 2 ====================
function startLoopingQuestion2() {
    currentLoopStep = 0;
    if (loopingInterval) clearInterval(loopingInterval);
    
    function updateOptions() {
        let optionText = '';
        const repeatCount = Math.pow(2, currentLoopStep);
        for (let i = 0; i < repeatCount; i++) {
            optionText += 'My Brain ';
        }
        const optionDiv = document.getElementById('looping-option-2');
        if (optionDiv) optionDiv.innerHTML = optionText.trim();
        currentLoopStep++;
        if (currentLoopStep > 4) currentLoopStep = 0;
    }
    
    updateOptions();
    loopingInterval = setInterval(updateOptions, 1000);
    
    const selectBtn = document.getElementById('looping-answer-2');
    if (selectBtn) {
        selectBtn.onclick = () => {
            clearInterval(loopingInterval);
            nextPage();
        };
    }
}

// ==================== RIDDLES ====================
let riddleTimers = { t1: null, t2: null, t3: null };

function startRiddle1() {
    let pieces = 3;
    const kitkat = document.getElementById('kitkatTimer1');
    if (riddleTimers.t1) clearInterval(riddleTimers.t1);
    riddleTimers.t1 = setInterval(() => {
        pieces--;
        if (kitkat) kitkat.innerText = '🍫'.repeat(pieces);
        if (pieces <= 0) { clearInterval(riddleTimers.t1); alert("You are so slow 🐢😂"); nextPage(); }
    }, 5000);
    document.getElementById('submitRiddle1').onclick = () => {
        const ans = document.getElementById('riddleAnswer1').value.trim().toUpperCase();
        if (ans === 'PHOTO ALBUM') { clearInterval(riddleTimers.t1); alert("Smart!"); nextPage(); }
        else alert("Wrong answer!");
    };
}

function startRiddle2() {
    let pieces = 3;
    const kitkat = document.getElementById('kitkatTimer2');
    if (riddleTimers.t2) clearInterval(riddleTimers.t2);
    riddleTimers.t2 = setInterval(() => {
        pieces--;
        if (kitkat) kitkat.innerText = '🍫'.repeat(pieces);
        if (pieces <= 0) { clearInterval(riddleTimers.t2); alert("You are so slow 🐢😂"); nextPage(); }
    }, 5000);
    document.getElementById('submitRiddle2').onclick = () => {
        const ans = document.getElementById('riddleAnswer2').value.trim().toUpperCase();
        if (ans === 'SHADOW') { clearInterval(riddleTimers.t2); alert("Smart!"); nextPage(); }
        else alert("Wrong answer!");
    };
}

function startRiddle3() {
    let pieces = 3;
    const kitkat = document.getElementById('kitkatTimer3');
    if (riddleTimers.t3) clearInterval(riddleTimers.t3);
    riddleTimers.t3 = setInterval(() => {
        pieces--;
        if (kitkat) kitkat.innerText = '🍫'.repeat(pieces);
        if (pieces <= 0) { clearInterval(riddleTimers.t3); alert("You are so slow 🐢😂"); nextPage(); }
    }, 3000);
    document.getElementById('submitRiddle3').onclick = () => {
        const ans = document.getElementById('riddleAnswer3').value.trim().toUpperCase();
        if (ans === 'KEYBOARD') { clearInterval(riddleTimers.t3); alert("Smart!"); nextPage(); }
        else alert("Wrong answer!");
    };
}

// ==================== GIFT BOXES ====================
function initBalloons() {
    const container = document.getElementById('balloon-random-container');
    if (!container) return;
    container.innerHTML = '';
    giftOpened = [];
    let foodChoice = foodAnswers[4] || 'Kitkat';
    for (let i = 0; i < totalGifts; i++) {
        const giftDiv = document.createElement('div');
        giftDiv.className = 'balloon-gift-item';
        giftDiv.innerHTML = `<div class="balloon-icon">🎈</div><div class="gift-icon">🎁</div>`;
        giftDiv.onclick = () => openGiftBox(i, foodChoice);
        container.appendChild(giftDiv);
    }
    document.getElementById('popped-count').innerText = '0';
    document.getElementById('balloon-message').innerHTML = '';
}

function openGiftBox(index, foodChoice) {
    if (giftOpened.includes(index)) return;
    playGiftSound();
    giftOpened.push(index);
    const msgDiv = document.getElementById('balloon-message');
    document.getElementById('popped-count').innerText = giftOpened.length;
    let message = '';
    if (giftOpened.length === 1) message = giftMessages[0](5);
    else if (giftOpened.length === 2) message = giftMessages[1](foodChoice);
    else if (giftOpened.length === 3) message = giftMessages[2](true);
    if (message) msgDiv.innerHTML = `<p>🎁 ${message}</p>`;
    if (giftOpened.length >= 3) setTimeout(() => nextPage(), 1000);
}

// ==================== YOUR PUZZLE CODE (EXACTLY AS PROVIDED) ====================
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

let moves = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;

// Change this name if your image file uses a different file format (like .png)
const currentImgSrc = 'shweta.jpg'; 

if (reloadBtn) reloadBtn.addEventListener('click', () => initGame(currentImgSrc));
setupHintButton();
initGame(currentImgSrc);

function initGame(imgSrc) {
    moves = 0;
    seconds = 0;
    gameStarted = false;
    if (moveCountLabel) moveCountLabel.textContent = moves;
    if (timerLabel) timerLabel.textContent = "00:00";
    clearInterval(timerInterval);
    if (winModal) winModal.style.display = 'none';
    if (mask) mask.style.display = 'none';

    if (board) {
        Array.from(board.children).forEach(child => {
            if(child !== hintOverlay) child.remove();
        });
    }
    if (pool) pool.innerHTML = '';

    if (hintOverlay) hintOverlay.style.backgroundImage = `url(${imgSrc})`;

    if (board) {
        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            slot.dataset.index = i;
            
            slot.addEventListener('dragover', e => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', handleDrop);
            board.appendChild(slot);
        }
    }

    if (pool) {
        pool.addEventListener('dragover', e => e.preventDefault());
        pool.addEventListener('drop', handleDrop);
    }

    let pieces = [];
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;

        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.id = `piece-${i}`;
        piece.draggable = true;
        piece.dataset.index = i;
        piece.style.backgroundImage = `url(${imgSrc})`;
        piece.style.backgroundSize = '300px 300px';
        piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;

        piece.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.id);
            startTimer();
        });

        pieces.push(piece);
    }

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(p => pool.appendChild(p));
}

function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    timerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        if (timerLabel) timerLabel.textContent = `${mins}:${secs}`;
    }, 1000);
}

function handleDrop(e) {
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

    checkWinCondition();
}

function updateMoves() {
    moves++;
    if (moveCountLabel) moveCountLabel.textContent = moves;
}

function setupHintButton() {
    if (!hintBtn || !hintOverlay) return;
    const showHint = () => hintOverlay.style.display = 'block';
    const hideHint = () => hintOverlay.style.display = 'none';

    hintBtn.addEventListener('mousedown', showHint);
    hintBtn.addEventListener('mouseup', hideHint);
    hintBtn.addEventListener('mouseleave', hideHint);

    hintBtn.addEventListener('touchstart', (e) => { e.preventDefault(); showHint(); });
    hintBtn.addEventListener('touchend', hideHint);
}

function checkWinCondition() {
    const slots = board.querySelectorAll('.slot');
    let accurateCount = 0;

    slots.forEach(slot => {
        if (slot.children.length > 0) {
            const embeddedPiece = slot.children[0];
            if (slot.dataset.index === embeddedPiece.dataset.index) {
                accurateCount++;
            }
        }
    });

    if (accurateCount === 9) {
        clearInterval(timerInterval);
        if (winDetails && timerLabel) winDetails.textContent = `Completed in ${moves} moves and ${timerLabel.textContent}!`;
        if (winModal) winModal.style.display = 'block';
        if (mask) mask.style.display = 'block';
    }
}

// ==================== CAKE ANIMATION ====================
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

// ==================== INITIALIZATION ====================
document.getElementById('next-1').addEventListener('click', function() {
    const name = document.getElementById('name-input').value.trim();
    if (!name) { alert('Please enter your name'); return; }
    userName = name;
    if (userName.toLowerCase() === 'shweta') {
        startHappyBirthdayMusic();
        showPage(2);
    } else {
        document.getElementById('rejectNameMsg').innerHTML = `Welcome ${userName}`;
        goToReject1();
    }
});

// Rejection page next buttons
document.getElementById('next-reject1').addEventListener('click', nextReject);
document.getElementById('next-reject2').addEventListener('click', nextReject);
document.getElementById('closeSiteBtn').addEventListener('click', closeSite);

document.getElementById('next-2').addEventListener('click', function() {
    const year = document.getElementById('year-input').value;
    if (year.trim()) showPage(3);
    else alert('Please enter your birth year!');
});

document.getElementById('next-3').addEventListener('click', () => showPage(4));

// Another Type Questions (pages 4-8)
for (let i = 4; i <= 8; i++) {
    const opts = document.querySelectorAll(`#page-${i} .option`);
    opts.forEach(opt => {
        opt.addEventListener('click', function() {
            anotherAnswers.push(this.innerText);
            showPage(i + 1);
        });
    });
}

// Food Questions (pages 9-13)
for (let i = 9; i <= 13; i++) {
    const opts = document.querySelectorAll(`#page-${i} .option`);
    opts.forEach(opt => {
        opt.addEventListener('click', function() {
            foodAnswers.push(this.innerText);
            if (i === 13) {
                document.getElementById('personalizedMsg').innerHTML = `I know you have chosen ${this.innerText}.`;
                showPage(14);
            } else {
                showPage(i + 1);
            }
        });
    });
}

document.getElementById('next-14').addEventListener('click', () => showPage(15));
document.getElementById('next-15').addEventListener('click', () => showPage(16));

// Riddles initialization
const page16 = document.getElementById('page-16');
if (page16) {
    const observer16 = new MutationObserver(function(mutations) {
        if (page16.classList.contains('active')) { startRiddle1(); observer16.disconnect(); }
    });
    observer16.observe(page16, { attributes: true });
}

const page17 = document.getElementById('page-17');
if (page17) {
    const observer17 = new MutationObserver(function(mutations) {
        if (page17.classList.contains('active')) { startRiddle2(); observer17.disconnect(); }
    });
    observer17.observe(page17, { attributes: true });
}

const page18 = document.getElementById('page-18');
if (page18) {
    const observer18 = new MutationObserver(function(mutations) {
    if (page18.classList.contains('active')) { startRiddle3(); observer18.disconnect(); }
    });
    observer18.observe(page18, { attributes: true });
}

document.getElementById('next-20').addEventListener('click', () => showPage(21));

// No Context Messages
let ncIndex = 0;
document.getElementById('nextNoContext').addEventListener('click', function() {
    ncIndex++;
    if (ncIndex < noContextMessages.length) {
        document.getElementById('noContextMessage').innerText = noContextMessages[ncIndex];
    } else {
        showPage(22);
    }
});

// Note: Page 22 is the puzzle page - it's handled by the puzzle code above
// The puzzle is on page-22, which is already active when showPage(22) is called

// Continue button for puzzle (after win modal)
const continuePuzzleBtn = document.getElementById('continuePuzzleBtn');
if (continuePuzzleBtn) {
    continuePuzzleBtn.addEventListener('click', () => {
        nextPage();
    });
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

// Initialize page 1
showPage(1);

