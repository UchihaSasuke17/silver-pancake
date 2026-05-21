let bgMusic = null;
let isMusicPlaying = false;
let musicEnabled = true;
let currentPageId = 'page1';
let userName = '';
let rejectStep = 1;
let anotherAnswers = [];
let foodAnswers = [];
let totalCorrect = 0;
let noContextIndex = 0;
let currentQuizSection = null;
let currentQuestionIndex = 0;
let timerInterval = null;
let riddleTimer = null;
let currentRiddle = 0;
let giftState = { opened: [], allCorrect: false, foodChoice: '', correctCount: 0 };
let puzzleSolved = false;

const anotherQuestions = [
    { q: "What would you prefer?", a: "Early Morning Vibes", b: "Midnight Vibes" },
    { q: "What would you prefer?", a: "Like to be Alone", b: "Like to be with people" },
    { q: "What would you prefer?", a: "Spending Summer on a beach", b: "Long ride on a bike at night" },
    { q: "What would you prefer?", a: "Cooking food alone", b: "Cooking with friends around a bonfire at night" },
    { q: "What would you prefer?", a: "Taking a walk alone at night", b: "Lying down and looking at the starry sky" }
];

const foodQuestions = [
    { q: "What is your favourite?", a: "Noodles", b: "Panipuri" },
    { q: "What is your favourite?", a: "Blackcurrant 🍨", b: "Vanilla 🍨" },
    { q: "What is your favourite?", a: "Spicy dishes", b: "Sweet dishes" },
    { q: "What is your favourite?", a: "Butterscotch Icecream", b: "Chocolate Icecream" },
    { q: "What is your favourite?", a: "Kitkat", b: "Dairy milk Hazelnut" }
];

const riddles = [
    { text: "I can hold moments forever, Yet I'm not alive. Open me and memories return. What am I?", format: "P_O_O A_B_M", answer: "PHOTO ALBUM", kitkatSec: 5 },
    { text: "I follow you everywhere, But disappear in darkness. What am I?", format: "SH_D_W", answer: "SHADOW", kitkatSec: 5 },
    { text: "I have keys but no locks, Space but no rooms, Once you enter you can only escape. What am I?", format: "K_Y B___D", answer: "KEYBOARD", kitkatSec: 3 }
];

const giftMessages = [
    (count) => `You have answered ${count} questions correctly.`,
    (option) => `I will send you 5 ${option} 🍫 for each correct question.`,
    (allCorrect) => allCorrect ? "You are damn smart 🤓" : "But still, you are too slow 🐢😂"
];

const noContextMessages = [
    "Wait a minute.....", "Did I forget something.....", "Give me a moment.....",
    "Is it Your Birthday 🎂 today.....", "Really.....", "Sorry I didn't wish you earlier....."
];

function playBackgroundMusic() {
    if (!musicEnabled || isMusicPlaying) return;
    bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.25;
        bgMusic.play().catch(e => console.log('Auto-play prevented'));
        isMusicPlaying = true;
    }
}

function playPopSound() {
    if (!musicEnabled) return;
    const pop = document.getElementById('popSound');
    if (pop) { pop.currentTime = 0; pop.play().catch(e => console.log('Pop error')); }
}

function playGiftSound() {
    if (!musicEnabled) return;
    const gift = document.getElementById('giftSound');
    if (gift) { gift.currentTime = 0; gift.play().catch(e => console.log('Gift error')); }
}

function playSuccessSound() {
    if (!musicEnabled) return;
    const success = document.getElementById('successSound');
    if (success) { success.currentTime = 0; success.play().catch(e => console.log('Success error')); }
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const icon = document.querySelector('.music-icon');
    if (bgMusic) {
        if (musicEnabled) { bgMusic.play(); if (icon) icon.textContent = '🔊'; }
        else { bgMusic.pause(); if (icon) icon.textContent = '🔇'; }
    }
}

function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    container.innerHTML = '';
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

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (el) el.classList.add('active');
    currentPageId = pageId;
}

function nextPage() {
    const pages = ['mailboxPage', 'quotePage', 'dynamicContent'];
    const idx = pages.indexOf(currentPageId);
    if (idx !== -1 && idx + 1 < pages.length) {
        if (pages[idx + 1] === 'dynamicContent') startQuiz();
        else showPage(pages[idx + 1]);
    }
}

function closeSite() { 
    document.body.innerHTML = '<div style="text-align:center; padding:60px; color:white;"><h1>Goodbye!</h1></div>'; 
}

function validateName() {
    const name = document.getElementById('nameInput').value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }
    userName = name;
    if (userName.toLowerCase() === 'shweta') {
        showPage('mailboxPage');
        playBackgroundMusic();
    } else {
        document.getElementById('rejectNameMsg').innerHTML = `Welcome ${userName}`;
        showPage('reject1');
    }
}

function nextReject() { 
    rejectStep++; 
    if (rejectStep === 2) showPage('reject2'); 
    else if (rejectStep === 3) showPage('reject3'); 
    else closeSite(); 
}

function openMailbox() {
    playPopSound();
    const mailbox = document.getElementById('mailbox');
    const letterContainer = document.getElementById('letterContainer');
    const petalContainer = document.getElementById('petalContainer');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const nextBtn = document.getElementById('nextAfterMailbox');
    
    if (mailbox) mailbox.style.pointerEvents = 'none';
    
    const letter = document.createElement('div');
    letter.className = 'flying-letter';
    letter.textContent = '✉️';
    letterContainer.appendChild(letter);
    
    setTimeout(() => {
        letter.remove();
        welcomeMsg.textContent = `Welcome ${userName}`;
        welcomeMsg.classList.remove('hidden');
        for (let i = 0; i < 50; i++) {
            const petal = document.createElement('div');
            petal.className = 'rose-petal';
            petal.textContent = '🌹';
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 150;
            petal.style.setProperty('--x', Math.cos(angle) * distance + 'px');
            petal.style.setProperty('--y', Math.sin(angle) * distance + 'px');
            petalContainer.appendChild(petal);
            setTimeout(() => petal.remove(), 1200);
        }
        nextBtn.classList.remove('hidden');
    }, 800);
}

function startQuiz() { 
    currentQuizSection = 'another'; 
    currentQuestionIndex = 0; 
    anotherAnswers = []; 
    foodAnswers = []; 
    renderQuiz(); 
}

function renderQuiz() {
    const container = document.getElementById('dynamicContent');
    if (!container) return;
    
    if (currentQuizSection === 'another' && currentQuestionIndex < anotherQuestions.length) {
        const q = anotherQuestions[currentQuestionIndex];
        container.innerHTML = `
            <div class="page active" style="display:block">
                <div class="page-header"><span class="page-number">📝 Another Type</span></div>
                <div class="question-text">${q.q}</div>
                <div class="options-container">
                    <div class="option-card" onclick="answerQuiz('${q.a.replace(/'/g, "\\'")}')">${q.a}</div>
                    <div class="option-card" onclick="answerQuiz('${q.b.replace(/'/g, "\\'")}')">${q.b}</div>
                </div>
                <div class="timer-display">⏱️ Time: <span id="quizTimer">10</span> sec</div>
            </div>
        `;
        startQuizTimer(10, () => answerQuiz(null));
    } 
    else if (currentQuizSection === 'another' && currentQuestionIndex >= anotherQuestions.length) {
        currentQuizSection = 'food'; 
        currentQuestionIndex = 0; 
        renderQuiz();
    }
    else if (currentQuizSection === 'food' && currentQuestionIndex < foodQuestions.length) {
        const q = foodQuestions[currentQuestionIndex];
        container.innerHTML = `
            <div class="page active" style="display:block">
                <div class="page-header"><span class="page-number">🍕 Food</span></div>
                <div class="question-text">${q.q}</div>
                <div class="options-container">
                    <div class="option-card" onclick="answerQuiz('${q.a.replace(/'/g, "\\'")}')">${q.a}</div>
                    <div class="option-card" onclick="answerQuiz('${q.b.replace(/'/g, "\\'")}')">${q.b}</div>
                </div>
                <div class="timer-display">⏱️ Time: <span id="quizTimer">10</span> sec</div>
            </div>
        `;
        startQuizTimer(10, () => answerQuiz(null));
    }
    else { 
        showPersonalizedMessage(); 
    }
}

function startQuizTimer(sec, onTimeout) {
    if (timerInterval) clearInterval(timerInterval);
    let time = sec;
    const el = document.getElementById('quizTimer');
    timerInterval = setInterval(() => { 
        time--; 
        if (el) el.innerText = time; 
        if (time <= 0) { 
            clearInterval(timerInterval); 
            onTimeout(); 
        } 
    }, 1000);
}

function answerQuiz(choice) {
    if (timerInterval) clearInterval(timerInterval);
    if (currentQuizSection === 'another') anotherAnswers.push(choice || 'No answer');
    else foodAnswers.push(choice || 'No answer');
    currentQuestionIndex++;
    renderQuiz();
}

function showPersonalizedMessage() {
    const foodChoice = foodAnswers[4] || 'Kitkat';
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">💬</span></div>
            <div class="question-text">I know you have chosen ${foodChoice}.</div>
            <button class="glow-btn" onclick="showChallengePage()">Next →</button>
        </div>
    `;
}

function showChallengePage() {
    const foodChoice = foodAnswers[4] || 'Kitkat';
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">🎯 Challenge</span></div>
            <div class="question-text">I have a challenge for you. If you answer correctly, I will send you 5 ${foodChoice} 🍫 for each correct answer.</div>
            <button class="glow-btn" onclick="startRiddles()">Begin →</button>
        </div>
    `;
}

function startRiddles() { 
    currentRiddle = 0; 
    totalCorrect = 0; 
    showRiddle(); 
}

function showRiddle() {
    if (currentRiddle >= riddles.length) { 
        showGiftBoxes(); 
        return; 
    }
    const r = riddles[currentRiddle];
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">🔐 Riddle ${currentRiddle+1}</span></div>
            <div class="question-text">${r.text}</div>
            <p style="color:white;">Format: ${r.format}</p>
            <input type="text" id="riddleAnswer" class="riddle-input" placeholder="Type answer...">
            <div class="kitkat-timer" id="kitkatTimer">🍫🍫🍫</div>
            <button class="glow-btn" onclick="checkRiddle()">Submit</button>
        </div>
    `;
    
    let pieces = 3;
    const kitkatEl = document.getElementById('kitkatTimer');
    if (riddleTimer) clearInterval(riddleTimer);
    const step = r.kitkatSec * 1000;
    riddleTimer = setInterval(() => { 
        pieces--; 
        if (kitkatEl) kitkatEl.innerText = '🍫'.repeat(pieces); 
        if (pieces <= 0) { 
            clearInterval(riddleTimer); 
            handleRiddleTimeout(); 
        } 
    }, step);
}

function handleRiddleTimeout() { 
    if (riddleTimer) clearInterval(riddleTimer); 
    alert("You are so slow 🐢😂"); 
    currentRiddle++; 
    showRiddle(); 
}

function checkRiddle() {
    const input = document.getElementById('riddleAnswer').value.trim().toUpperCase();
    const correct = riddles[currentRiddle].answer;
    if (input === correct) { 
        totalCorrect++; 
        alert("Smart!"); 
    } else { 
        alert("Wrong answer!"); 
    }
    if (riddleTimer) clearInterval(riddleTimer);
    currentRiddle++;
    showRiddle();
}

function showGiftBoxes() {
    const allCorrect = (totalCorrect === riddles.length);
    const foodChoice = foodAnswers[4] || 'Kitkat';
    const container = document.getElementById('dynamicContent');
    let giftsHtml = '';
    for (let i = 0; i < 7; i++) {
        giftsHtml += `
            <div class="balloon-gift" onclick="openGift(${i})">
                <div class="balloon-icon">🎈</div>
                <div class="gift-icon">🎁</div>
            </div>
        `;
    }
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">🎁 Gift Boxes</span></div>
            <div class="gifts-grid" id="giftsGrid">${giftsHtml}</div>
            <div id="giftMsg" class="gift-message-area"></div>
        </div>
    `;
    giftState = { opened: [], allCorrect, foodChoice, correctCount: totalCorrect };
}

function openGift(idx) {
    if (giftState.opened.includes(idx)) return;
    playGiftSound();
    giftState.opened.push(idx);
    const msgDiv = document.getElementById('giftMsg');
    let msg = '';
    if (giftState.opened.length === 1) {
        msg = giftMessages[0](giftState.correctCount);
    } else if (giftState.opened.length === 2) {
        msg = giftMessages[1](giftState.foodChoice);
    } else if (giftState.opened.length === 3) {
        msg = giftMessages[2](giftState.allCorrect);
    }
    if (msg) {
        msgDiv.innerHTML += `<p>🎁 ${msg}</p>`;
    }
    if (giftState.opened.length >= 3) {
        setTimeout(() => showFinalQuote(), 1000);
    }
}

function showFinalQuote() {
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">✨</span></div>
            <div class="quote-card">
                <p class="beautiful-quote">"Wherever life takes you, always remember: you are loved, you are enough, and you are a beautiful soul."</p>
            </div>
            <button class="glow-btn" onclick="startNoContext()">Next →</button>
        </div>
    `;
}

function startNoContext() { 
    noContextIndex = 0; 
    showNoContext(); 
}

function showNoContext() {
    if (noContextIndex >= noContextMessages.length) { 
        showHugeGiftBox(); 
        return; 
    }
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">🤔</span></div>
            <div class="no-context-card">${noContextMessages[noContextIndex]}</div>
            <button class="glow-btn" onclick="nextNoContext()">Next →</button>
        </div>
    `;
}

function nextNoContext() { 
    noContextIndex++; 
    showNoContext(); 
}

function showHugeGiftBox() {
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">🎁</span></div>
            <div style="font-size:5rem; text-align:center; cursor:pointer;" onclick="showPuzzle()">🎁🎈</div>
            <p style="color:#FFD700; text-align:center;">Click to open</p>
        </div>
    `;
}

function showPuzzle() { 
    playPopSound(); 
    const container = document.getElementById('dynamicContent'); 
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="page-header"><span class="page-number">🧩 Puzzle</span></div>
            <div class="puzzle-container"><div class="puzzle-grid" id="puzzleGrid"></div></div>
            <div id="puzzleMsg" class="puzzle-message"></div>
        </div>
    `; 
    initPuzzle(); 
}

const imageUrl = 'shweta.jpg';
let pieces = [];
let emptyIndex = 15;
const puzzleSize = 4;

function initPuzzle() { 
    pieces = Array.from({ length: 16 }, (_, i) => i); 
    for (let i = pieces.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]]; 
    } 
    emptyIndex = pieces.indexOf(15); 
    renderPuzzle(); 
}

function renderPuzzle() {
    const grid = document.getElementById('puzzleGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < pieces.length; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        if (pieces[i] === 15) {
            piece.classList.add('empty');
        } else {
            const row = Math.floor(pieces[i] / puzzleSize);
            const col = pieces[i] % puzzleSize;
            piece.style.backgroundImage = `url('${imageUrl}')`;
            piece.style.backgroundSize = '400% 400%';
            piece.style.backgroundPosition = `${col * 33.33}% ${row * 33.33}%`;
        }
        piece.addEventListener('click', () => tryMove(i));
        grid.appendChild(piece);
    }
}

function tryMove(idx) {
    if (puzzleSolved) return;
    const clickRow = Math.floor(idx / puzzleSize);
    const clickCol = idx % puzzleSize;
    const emptyRow = Math.floor(emptyIndex / puzzleSize);
    const emptyCol = emptyIndex % puzzleSize;
    if (Math.abs(clickRow - emptyRow) + Math.abs(clickCol - emptyCol) === 1) { 
        [pieces[idx], pieces[emptyIndex]] = [pieces[emptyIndex], pieces[idx]]; 
        emptyIndex = idx; 
        renderPuzzle(); 
        if (pieces.every((v, i) => v === i)) { 
            puzzleSolved = true; 
            document.getElementById('puzzleMsg').innerHTML = '🎉 Puzzle solved! 🎉'; 
            playSuccessSound(); 
            setTimeout(() => showCakeAnimation(), 1500); 
        } 
    }
}

function showCakeAnimation() {
    playPopSound();
    const container = document.getElementById('dynamicContent');
    container.innerHTML = `
        <div class="page active" style="display:block">
            <div class="cake-animation-area" id="cakeArea"></div>
            <div id="cakeMsg" class="final-birthday-message"></div>
        </div>
    `;
    let layers = 0;
    const interval = setInterval(() => {
        const cakeDiv = document.getElementById('cakeArea');
        const cake = document.createElement('div');
        cake.className = 'falling-cake-layer';
        cake.textContent = '🎂';
        cakeDiv.appendChild(cake);
        setTimeout(() => cake.remove(), 1400);
        layers++;
        if (layers >= 6) { 
            clearInterval(interval); 
            document.getElementById('cakeMsg').innerHTML = "Happy Birthday 🎂 Shwetaaaaaa Sister"; 
            playSuccessSound();
        }
    }, 800);
        }
