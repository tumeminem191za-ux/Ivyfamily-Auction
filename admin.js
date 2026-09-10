import { db } from "./firebase.js";

import {
 collection,
 onSnapshot,
 query,
 orderBy,
 addDoc,
 getDocs,
 deleteDoc,
 doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];
let players=[];
let angle=0;
let spinning=false;
let selectedWinner=null;



// LOGIN

window.login=function(){

let pass=document.getElementById("pass").value;


if(pass==="1234"){

document.getElementById("admin").style.display="block";

loadHistory();

}

else{

alert("รหัสผิด");

}

};




// โหลดข้อมูล realtime

onSnapshot(

query(
collection(db,"bids"),
orderBy("time","asc")
),

snap=>{


data=[];


snap.forEach(d=>{

let x=d.data();


if(x.name && x.item){

data.push({

id:d.id,

...x

});

}


});


}

);





// โหลดคนเข้าในวงล้อ

window.loadWheel=function(){


let item=
document.getElementById("wheelItem").value;



players=[

...new Set(

data

.filter(x=>x.item===item)

.map(x=>x.name)

)

];



document.getElementById("players").innerHTML=


players.map(x=>`

<div class="player">
👤 ${x}
</div>

`).join("");



drawWheel();


};






// วาดวงล้อ

function drawWheel(){


let canvas=document.getElementById("wheel");

let ctx=canvas.getContext("2d");


let r=canvas.width/2;


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



if(players.length===0)return;



let colors=[

"#ff595e",
"#ffca3a",
"#8ac926",
"#1982c4",
"#6a4c93",
"#ff924c",
"#00b4d8",
"#f72585",
"#43aa8b",
"#577590"

];



let size=
(Math.PI*2)/players.length;



players.forEach((name,i)=>{


let start=
angle+(i*size);



ctx.beginPath();

ctx.moveTo(r,r);

ctx.arc(
r,
r,
r-5,
start,
start+size
);


ctx.fillStyle=
colors[i%colors.length];


ctx.fill();


ctx.strokeStyle="#fff";

ctx.lineWidth=3;

ctx.stroke();



ctx.save();


ctx.translate(r,r);

ctx.rotate(
start+(size/2)
);


ctx.fillStyle="#fff";

ctx.shadowColor="#000";

ctx.shadowBlur=8;


ctx.font="bold 16px sans-serif";


ctx.fillText(
name,
80,
5
);


ctx.restore();


});



// กลางวง

ctx.beginPath();

ctx.arc(
r,
r,
50,
0,
Math.PI*2
);


ctx.fillStyle="#111";

ctx.fill();


ctx.fillStyle="#ffd700";

ctx.font="bold 22px sans-serif";

ctx.textAlign="center";


ctx.fillText(
"IVY",
r,
r+8
);



// เข็ม

ctx.beginPath();

ctx.moveTo(r-25,0);

ctx.lineTo(r+25,0);

ctx.lineTo(r,45);

ctx.closePath();


ctx.fillStyle="#ffd700";

ctx.fill();


}
