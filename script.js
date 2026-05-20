function trackEvent(category, action, label) {
    console.log(category, action, label);
}

let bgMusic = null;
let isMusicPlaying = false;
let musicEnabled = true;

function playBackgroundMusic() {

    if (!musicEnabled || isMusicPlaying) return;

    bgMusic = document.getElementById('bgMusic');

    if (bgMusic) {

        bgMusic.volume = 0.3;

        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
            })
            .catch(() => {
                console.log("Autoplay blocked");
            });
    }
}

function playPopSound() {

    if (!musicEnabled) return;

    const pop = document.getElementById('popSound');

    if (pop) {

        pop.currentTime = 0;

        pop.play().catch(() => {});
    }
}

function toggleMusic() {

    musicEnabled = !musicEnabled;

    const control =
        document.getElementById('musicControl');

    if (bgMusic) {

        if (musicEnabled) {

            bgMusic.play();

            control.innerHTML = '🔊';

        } else {

            bgMusic.pause();

            control.innerHTML = '🔇';
        }
    }
}

let currentPageId = 'page1';
let userName = '';
let rejectStep = 1;

function showPage(pageId) {

    document
        .querySelectorAll('.page')
        .forEach(page => {
            page.classList.remove('active');
        });

    const page = document.getElementById(pageId);

    if (page) {

        page.classList.add('active');

        currentPageId = pageId;
    }
}

function validateName() {

    const input =
        document.getElementById('nameInput');

    const name = input.value.trim();

    if (!name) {

        alert("Please enter your name");

        return;
    }

    userName = name;

    if (name.toLowerCase() === 'shweta') {

        showPage('mailboxPage');

        playBackgroundMusic();

    } else {

        document
            .getElementById('rejectNameMsg')
            .innerHTML = `Welcome ${userName}`;

        showPage('reject1');
    }
}

function nextReject() {

    rejectStep++;

    if (rejectStep === 2) {

        showPage('reject2');

    } else if (rejectStep === 3) {

        showPage('reject3');

    } else {

        closeSite();
    }
}

function closeSite() {

    document.body.innerHTML = `
        <div style="
            color:white;
            text-align:center;
            padding-top:100px;
        ">
            <h1>Goodbye 👋</h1>
        </div>
    `;
}

function openMailbox() {

    playPopSound();

    const mailbox =
        document.getElementById('mailbox');

    const letterContainer =
        document.getElementById('letterContainer');

    const petalContainer =
        document.getElementById('petalContainer');

    const welcomeMsg =
        document.getElementById('welcomeMsg');

    mailbox.style.pointerEvents = 'none';

    const letter = document.createElement('div');

    letter.className = 'letter';

    letter.innerHTML = '✉️';

    letterContainer.appendChild(letter);

    setTimeout(() => {

        letter.remove();

        welcomeMsg.innerHTML =
            `Welcome ${userName} 💖`;

        for (let i = 0; i < 40; i++) {

            const petal =
                document.createElement('div');

            petal.className = 'rose-petal';

            petal.innerHTML = '🌹';

            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                100 + Math.random() * 200;

            petal.style.setProperty(
                '--x',
                `${Math.cos(angle) * distance}px`
            );

            petal.style.setProperty(
                '--y',
                `${Math.sin(angle) * distance}px`
            );

            petalContainer.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, 1000);
        }

        document
            .getElementById('nextAfterMailbox')
            .classList.remove('hidden');

    }, 800);
}

function nextPage() {

    if (currentPageId === 'mailboxPage') {

        showPage('quotePage');

    } else if (currentPageId === 'quotePage') {

        startFinalPage();
    }
}

function startFinalPage() {

    const container =
        document.getElementById('dynamicContent');

    container.innerHTML = `
        <div class="page active">

            <h2>🎉 Happy Birthday Shweta 🎂</h2>

            <p class="quote">
                May your day be filled with happiness,
                smiles and beautiful memories ✨
            </p>

            <div id="balloons"></div>

            <div style="
                font-size:5rem;
                margin-top:40px;
                animation:bounce 2s infinite;
            ">
                🎂
            </div>

        </div>
    `;

    createFloatingBalloons();
}

function createFloatingBalloons() {

    for(let i = 0; i < 25; i++) {

        const balloon =
            document.createElement('div');

        balloon.innerHTML = '🎈';

        balloon.style.position = 'fixed';

        balloon.style.left =
            Math.random() * 100 + 'vw';

        balloon.style.bottom = '-50px';

        balloon.style.fontSize =
            (2 + Math.random() * 2) + 'rem';

        balloon.style.animation =
            `floatUp ${5 + Math.random() * 5}s linear infinite`;

        balloon.style.cursor = 'pointer';

        balloon.onclick = () => {

            playPopSound();

            balloon.innerHTML = '💥';

            setTimeout(() => {
                balloon.remove();
            }, 200);
        };

        document.body.appendChild(balloon);
    }
}

function createStars() {

    const stars =
        document.getElementById('stars');

    for(let i = 0; i < 150; i++) {

        const star =
            document.createElement('div');

        star.className = 'star';

        const size = Math.random() * 3;

        star.style.width = size + 'px';

        star.style.height = size + 'px';

        star.style.left =
            Math.random() * 100 + '%';

        star.style.top =
            Math.random() * 100 + '%';

        star.style.animationDelay =
            Math.random() * 5 + 's';

        stars.appendChild(star);
    }
}

createStars();
