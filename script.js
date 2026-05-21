let userName="";
let rejectStep=1;
let current="page1";

/* MUSIC */
let musicStarted=false;

function playMusic(){
const m=document.getElementById("bgMusic");
if(!m||musicStarted) return;
m.play().then(()=>musicStarted=true).catch(()=>{});
}

function toggleMusic(){
document.getElementById("bgMusic").play();
}

/* NAV */
function show(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
current=id;
}

/* NAME */
function validateName(){
let n=document.getElementById("nameInput").value.trim();
if(!n) return;

userName=n;

if(n.toLowerCase()==="shweta"){
show("mailboxPage");
document.addEventListener("click",playMusic,{once:true});
}else{
document.getElementById("rejectNameMsg").innerText="Welcome "+n;
show("reject1");
}
}

/* REJECT */
function nextReject(){
rejectStep++;
if(rejectStep===2) show("reject2");
else if(rejectStep===3) show("reject3");
else closeSite();
}

function closeSite(){
document.body.innerHTML="Goodbye";
}

/* MAILBOX */
function openMailbox(){
document.getElementById("welcomeMsg").innerText="Welcome "+userName;
document.getElementById("nextAfterMailbox").classList.remove("hidden");
}

/* FLOW */
function nextPage(){
if(current==="mailboxPage") show("quotePage");
else startQuiz();
}

/* ================= QUIZ ================= */

let quizTimer;
let timeLeft=10;
let qIndex=0;
let section="another";

const another=[
["Morning or Night","Morning","Night"],
["Alone or People","Alone","People"]
];

const food=[
["Noodles or Panipuri","Noodles","Panipuri"],
["Chocolate or Vanilla","Chocolate","Vanilla"]
];

function startQuiz(){
qIndex=0;
section="another";
loadQ();
}

function loadQ(){
const data=section==="another"?another:food;

if(qIndex>=data.length){
if(section==="another"){section="food";qIndex=0;loadQ();return;}
else return startRiddles();
}

const q=data[qIndex];

document.getElementById("dynamicContent").innerHTML=`
<div class="page active">
<h2>${q[0]}</h2>
<div>⏱️ <span id="timer">10</span></div>
<button onclick="ans()">A</button>
<button onclick="ans()">B</button>
</div>`;

startTimer();
}

function startTimer(){
timeLeft=10;

quizTimer=setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText=timeLeft;

if(timeLeft<=0){
clearInterval(quizTimer);
ans();
}
},1000);
}

function ans(){
clearInterval(quizTimer);
qIndex++;
loadQ();
}

/* ================= RIDDLES ================= */

let rIndex=0;
let correct=0;
let choco=3;
let rTimer;

const riddles=[
["Photo Album","PHOTO ALBUM",15],
["Shadow","SHADOW",15],
["Keyboard","KEYBOARD",9]
];

function startRiddles(){
rIndex=0;
showRiddle();
}

function showRiddle(){
if(rIndex>=riddles.length){
return showPuzzle();
}

const r=riddles[rIndex];

choco=3;

document.getElementById("dynamicContent").innerHTML=`
<div class="page active">
<h2>${r[0]}</h2>
<input id="ans">
<div id="choco">🍫🍫🍫</div>
<button onclick="check()">Submit</button>
</div>`;

rTimer=setInterval(()=>{
choco--;
document.getElementById("choco").innerText="🍫".repeat(choco);

if(choco<=0){
clearInterval(rTimer);
rIndex++;
showRiddle();
}
},r[2]*1000);
}

function check(){
clearInterval(rTimer);

let v=document.getElementById("ans").value.toUpperCase();

if(v===riddles[rIndex][1]) correct++;

rIndex++;
showRiddle();
}

/* ================= PUZZLE ================= */

const img="shweta.png";
let pieces=[];
let empty=15;

function showPuzzle(){
document.getElementById("dynamicContent").innerHTML=`
<div class="page active">
<h2>Puzzle</h2>
<div id="grid" class="puzzle-grid"></div>
</div>`;

initPuzzle();
}

function initPuzzle(){
pieces=[...Array(16).keys()];

for(let i=15;i>0;i--){
let j=Math.floor(Math.random()*16);
[pieces[i],pieces[j]]=[pieces[j],pieces[i]];
}

empty=pieces.indexOf(15);
render();
}

function render(){
const g=document.getElementById("grid");
g.innerHTML="";

for(let i=0;i<16;i++){
let d=document.createElement("div");
d.className="puzzle-piece";

if(pieces[i]!==15){
let r=Math.floor(pieces[i]/4);
let c=pieces[i]%4;

d.style.backgroundImage=`url(${img})`;
d.style.backgroundSize="400% 400%";
d.style.backgroundPosition=`${c*33.33}% ${r*33.33}%`;
}else d.classList.add("empty");

d.onclick=()=>move(i);
g.appendChild(d);
}
}

function move(i){
let r1=Math.floor(i/4),c1=i%4;
let r2=Math.floor(empty/4),c2=empty%4;

if(Math.abs(r1-r2)+Math.abs(c1-c2)===1){
[pieces[i],pieces[empty]]=[pieces[empty],pieces[i]];
empty=i;
render();
}
}
