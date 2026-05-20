let userName = "";
let img = null;
let pieces = [];
let dragged = null;

// ---------- PAGE CONTROL ----------
function show(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// ---------- NAME ----------
function validateName(){
    let name = document.getElementById("nameInput").value;

    if(name.toLowerCase() === "shweta"){
        userName = name;
        show("mailboxPage");
    } else {
        document.getElementById("rejectMsg").innerText = "Not allowed!";
        show("reject1");
    }
}

function nextReject(){ show("reject2"); setTimeout(()=>show("reject3"),1000); }
function closeSite(){ document.body.innerHTML = "Closed"; }

// ---------- MAILBOX ----------
function openMailbox(){
    document.getElementById("welcomeMsg").innerText = "Welcome " + userName;
}

function nextFromMailbox(){ show("quotePage"); }

// ---------- QUIZ ----------
function startQuiz(){
    showPuzzle();
}

// ---------- PUZZLE ----------
function showPuzzle(){
    document.getElementById("dynamic").innerHTML = `
        <h2>Upload Image Puzzle</h2>
        <input type="file" id="file">
        <button onclick="createPuzzle()">Create</button>
        <div id="puzzleBoard"></div>
    `;

    document.getElementById("file").onchange = e=>{
        let reader = new FileReader();
        reader.onload = ev=> img = ev.target.result;
        reader.readAsDataURL(e.target.files[0]);
    }
}

function createPuzzle(){
    if(!img){ alert("Upload image"); return; }

    let board = document.getElementById("puzzleBoard");
    board.innerHTML = "";
    pieces = [];

    let order = [...Array(16).keys()].sort(()=>Math.random()-0.5);

    order.forEach(pos=>{
        let div = document.createElement("div");
        div.className = "piece";

        let row = Math.floor(pos/4);
        let col = pos%4;

        div.style.backgroundImage = `url(${img})`;
        div.style.backgroundPosition = `-${col*80}px -${row*80}px`;

        div.draggable = true;

        div.ondragstart = ()=> dragged = div;
        div.ondragover = e=>e.preventDefault();

        div.ondrop = ()=>{
            if(dragged && dragged!==div){
                let temp = div.style.backgroundPosition;
                div.style.backgroundPosition = dragged.style.backgroundPosition;
                dragged.style.backgroundPosition = temp;
                checkWin();
            }
        };

        board.appendChild(div);
        pieces.push(div);
    });
}

// ---------- WIN ----------
function checkWin(){
    let board = document.getElementById("puzzleBoard").children;

    let win = true;

    for(let i=0;i<16;i++){
        let row = Math.floor(i/4);
        let col = i%4;

        let correct = `-${col*80}px -${row*80}px`;

        if(board[i].style.backgroundPosition !== correct){
            win = false;
        }
    }

    if(win){
        alert("🎉 Puzzle Solved!");
    }
}
