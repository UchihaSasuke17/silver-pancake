let currentPage = 1;
let musicStarted = false;
let selectedNumber = null;
let audioContext = null;
let musicGain = null;
let melodyInterval = null;
let poppedCount = 0;
let complimentIndices = [];
const totalBalloons = 19;

// Happy Birthday melody notes
const happyBirthdayNotes = [
    523.25, 523.25, 587.33, 523.25, 698.46, 659.25,
    523.25, 523.25, 587.33, 523.25, 783.99, 698.46,
    523.25, 523.25, 1046.50, 880.00, 698.46, 659.25, 587.33,
    1046.50, 1046.50, 880.00, 698.46, 783.99, 698.46
];

// Compliments for balloons
const compliments = [
    "Beautiful 💕",
    "Lovely 🌸",
    "Unique 💞",
    "Genuine 💖",
    "Sweet 🍭",
    "Precious 💎",
    "Loyal 🤝"
];
const specialBalloon = "You 🎂";
const funBalloon = "Try again 😜";

// Ribbon colors
const ribbonColors = ['#FF69B4', '#FF1493', '#FFA500', '#FF4500', '#FFD700', '#FF8C00'];

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
        
        console.log("🎵 Happy Birthday music started!");
    } catch(e) {
        console.log("Audio error:", e);
    }
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
            const time = audioContext.currentTime;
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(200 + Math.random() * 1000, time);
            osc.type = 'sawtooth';
            
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            
            osc.start(time);
            osc.stop(time + 0.1);
        }, i * 100);
    }
}

function createOrangeDust(button) {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const dust = document.createElement('div');
            dust.className = 'orange-dust';
            
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            dust.style.left = x + 'px';
            dust.style.top = y + 'px';
            dust.style.position = 'fixed';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 50;
            const duration = Math.random() * 1000 + 500;
            
            dust.animate([
                { opacity: 0.8, transform: 'scale(1)' },
                { opacity: 0, transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.1)` }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            document.body.appendChild(dust);
            
            setTimeout(() => {
                if (dust.parentNode) dust.parentNode.removeChild(dust);
            }, duration + 100);
        }, i * 50);
    }
}

function startRibbons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const ribbon = document.createElement('div');
        ribbon.className = 'ribbon';
        
        const left = Math.random() * 100;
        const duration = Math.random() * 4 + 3;
        const delay = Math.random() * 2;
        
        ribbon.style.left = left + '%';
        ribbon.style.animationDuration = duration + 's';
        ribbon.style.animationDelay = delay + 's';
        ribbon.style.background = `linear-gradient(145deg, ${ribbonColors[Math.floor(Math.random() * ribbonColors.length)]}, ${ribbonColors[Math.floor(Math.random() * ribbonColors.length)]})`;
        
        container.appendChild(ribbon);
    }
}

function showPage(pageNum) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${pageNum}`).classList.add('active');
    currentPage = pageNum;
    
    if (pageNum === 14) {
        initBalloons();
    }
    if (pageNum === 16) {
        startRibbons('ribbons-container-16');
    }
    if (pageNum === 18) {
        startRibbons('ribbons-container-18');
    }
    if (pageNum === 19) {
        startCakeFalling();
    }
}

function nextPage() {
    if (currentPage < 19) {
        showPage(currentPage + 1);
    }
}

// Page 1 Next
document.getElementById('next-1').addEventListener('click', function() {
    const name = document.getElementById('name-input').value;
    if (name.trim()) {
        startHappyBirthdayMusic();
        nextPage();
    } else {
        alert('Please enter your name!');
    }
});

// Page 2 Next
document.getElementById('next-2').addEventListener('click', function() {
    const year = document.getElementById('year-input').value;
    if (year.trim()) {
        nextPage();
    } else {
        alert('Please enter your birth year!');
    }
});

// Page 3 Next
document.getElementById('next-3').addEventListener('click', nextPage);

// Page 4 - Paper Airplane Selection
document.querySelectorAll('.airplane').forEach(plane => {
    plane.addEventListener('click', function() {
        if (selectedNumber) return;
        
        selectedNumber = this.dataset.number;
        const number = parseInt(selectedNumber);
        let treatCount;
        
        if (number === 7) treatCount = 7;
        else if (number === 17) treatCount = 8;
        else if (number === 23) treatCount = 5;
        
        this.classList.add('fly-away');
        
        document.querySelectorAll('.airplane').forEach(p => {
            if (p !== this) {
                p.style.opacity = '0.3';
                p.style.pointerEvents = 'none';
            }
        });
        
        setTimeout(() => {
            document.getElementById('treat-number').textContent = treatCount;
            nextPage();
        }, 1000);
    });
});

// Page 5 Next
document.getElementById('next-5').addEventListener('click', nextPage);

// Options for pages 6-13
for (let i = 6; i <= 13; i++) {
    document.querySelectorAll(`#page-${i} .option`).forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll(`#page-${i} .option`).forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            setTimeout(nextPage, 500);
        });
    });
}

// Page 15 Next
document.getElementById('next-15').addEventListener('click', nextPage);

// Page 16 Heart Yes Button
document.getElementById('heart-yes-16').addEventListener('click', function() {
    createOrangeDust(this);
    this.style.transform = 'rotate(45deg) scale(1.2)';
    setTimeout(() => {
        nextPage();
    }, 500);
});

// Page 17 Here We Go option
document.getElementById('here-we-go').addEventListener('click', function() {
    this.style.transform = 'scale(1.1)';
    setTimeout(nextPage, 500);
});

// Page 18 Heart Yes Button
document.getElementById('heart-yes-18').addEventListener('click', function() {
    createOrangeDust(this);
    this.style.transform = 'rotate(45deg) scale(1.2)';
    setTimeout(() => {
        nextPage();
    }, 500);
});

// Page 14 - Random Floating Balloons with "You 🎂" LAST
function initBalloons() {
    const container = document.getElementById('balloon-random-container');
    if (!container) return;
    
    container.innerHTML = '';
    poppedCount = 0;
    document.getElementById('popped-count').textContent = poppedCount;
    document.getElementById('balloon-message').innerHTML = '';
    
    // Randomly select 7 indices for compliments (0-17 only - not including 18)
    complimentIndices = [];
    while (complimentIndices.length < 7) {
        const randomIndex = Math.floor(Math.random() * 18); // 0-17 only
        if (!complimentIndices.includes(randomIndex)) {
            complimentIndices.push(randomIndex);
        }
    }
    
    // Create 19 balloons - index 18 will be the special "You 🎂" balloon
    for (let i = 0; i < totalBalloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.dataset.index = i;
        
        // Special styling for the last balloon (index 18)
        if (i === 18) {
            balloon.classList.add('balloon-special');
            balloon.textContent = '🎂';
        } else {
            // Random emoji on regular balloons
            const emojis = ['🎈', '🎁', '✨', '💕', '🌟', '🫰'];
            balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }
        
        // Random position within container
        const left = Math.random() * 80 + 5; // 5% to 85%
        const top = Math.random() * 70 + 5;  // 5% to 75%
        balloon.style.left = left + '%';
        balloon.style.top = top + '%';
        
        // Random float animation
        const duration = Math.random() * 4 + 3; // 3-7 seconds
        balloon.style.animation = `floatRandom ${duration}s ease-in-out infinite alternate`;
        
        // Click event
        balloon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (this.classList.contains('popped')) return;
            
            // Don't allow popping the special balloon until all others are popped
            const index = parseInt(this.dataset.index);
            if (index === 18 && poppedCount < 18) {
                document.getElementById('balloon-message').innerHTML = "🎈 Pop all other balloons first! 🎈";
                return;
            }
            
            this.classList.add('popped');
            poppedCount++;
            document.getElementById('popped-count').textContent = poppedCount;
            
            let message = '';
            
            if (index === 18) {
                message = specialBalloon;
            } else if (complimentIndices.includes(index)) {
                const complimentIndex = complimentIndices.indexOf(index);
                message = compliments[complimentIndex];
            } else {
                message = funBalloon;
            }
            
            document.getElementById('balloon-message').innerHTML = message;
            
            // Add pop sound effect
            if (audioContext) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 800;
                gain.gain.value = 0.1;
                osc.start();
                osc.stop(audioContext.currentTime + 0.1);
            }
            
            // Check if all balloons popped
            if (poppedCount === totalBalloons) {
                setTimeout(() => {
                    document.getElementById('balloon-message').innerHTML = "🎉 All balloons popped! 🎉";
                    setTimeout(() => {
                        nextPage();
                    }, 1500);
                }, 500);
            }
        });
        
        container.appendChild(balloon);
    }
}

// Page 19 - Cake falling animation
function startCakeFalling() {
    const skyContainer = document.getElementById('sky-container');
    const finalMessage = document.getElementById('final-message-container');
    
    skyContainer.innerHTML = '';
    
    // Create falling cakes
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const cake = document.createElement('div');
            cake.className = 'falling-cake';
            
            // Create cake layers
            const layer1 = document.createElement('div');
            layer1.className = 'cake-layer layer1';
            const layer2 = document.createElement('div');
            layer2.className = 'cake-layer layer2';
            const layer3 = document.createElement('div');
            layer3.className = 'cake-layer layer3';
            const candle = document.createElement('div');
            candle.className = 'candle';
            const flame = document.createElement('div');
            flame.className = 'flame';
            
            candle.appendChild(flame);
            cake.appendChild(layer1);
            cake.appendChild(layer2);
            cake.appendChild(layer3);
            cake.appendChild(candle);
            
            cake.style.left = Math.random() * 80 + 10 + '%';
            cake.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            skyContainer.appendChild(cake);
            
            setTimeout(() => {
                cake.remove();
            }, 6000);
        }, i * 200);
    }
    
    // Show final message
    setTimeout(() => {
        finalMessage.style.display = 'block';
        playCrackersSound();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showPage(1);
});
