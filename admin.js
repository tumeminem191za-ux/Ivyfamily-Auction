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


let data = [];

let players = [];

let angle = 0;

let spinning = false;



// ================= LOGIN =================


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





// ================= LOAD DATA =================


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






// ================= LOAD WHEEL =================


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








// ================= DRAW =================


function drawWheel(){


let canvas=
document.getElementById("wheel");


let ctx=
canvas.getContext("2d");


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




// ชื่อ


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




// กลาง


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








// ================= SPIN =================


window.spin=function(){


if(spinning)return;


if(players.length<2){

alert("ต้องมีคนแย่งอย่างน้อย 2 คน");

return;

}



spinning=true;



let startAngle=angle;



let rounds=
Math.PI*2*8;



let extra=
Math.random()*Math.PI*2;



let target=
rounds+extra;



let startTime=null;


let duration=7000;




function animate(time){


if(!startTime)

startTime=time;



let progress=
(time-startTime)/duration;



if(progress>1)

progress=1;



// ค่อยๆช้าลง

let ease=
1-Math.pow(1-progress,5);



angle=
startAngle+(target*ease);



drawWheel();



if(progress<1){


requestAnimationFrame(animate);


}

else{


angle=
angle%(Math.PI*2);


drawWheel();


finishSpin();


}


}



requestAnimationFrame(animate);


};








// ================= FINISH =================


async function finishSpin(){



let item=
document.getElementById("wheelItem").value;



// ใช้ตำแหน่งเข็มด้านบนคำนวณ

let size=
(Math.PI*2)/players.length;



let normalized=
(2*Math.PI-angle)%(Math.PI*2);



let index=
Math.floor(
normalized/size
);



if(index<0)

index=0;



let winner=
players[index];




// กัน undefined

if(!winner){

winner=players[0];

}



let winData=
data.find(x=>

x.item===item &&
x.name===winner

);





document.getElementById("winnerBox").style.display="block";



document.getElementById("winnerName").innerHTML=

"🏆 "+winner;



document.getElementById("winnerItem").innerHTML=

`
📦 ${item}
<br>
📄 หน้า ${winData?.page || "-"}
ชิ้น ${winData?.piece || "-"}
`;



document.getElementById("result").innerHTML=

"🎉 ผู้ได้สิทธิ์: "+winner;







await addDoc(

collection(db,"history"),

{

item:item,

winner:winner,

page:winData?.page || "",

piece:winData?.piece || "",

time:new Date().toLocaleString("th-TH")

}

);



loadHistory();


spinning=false;


}






// ================= HISTORY =================


async function loadHistory(){


let box=
document.getElementById("history");


if(!box)return;



let snap=
await getDocs(
collection(db,"history")
);



box.innerHTML="";



snap.forEach(d=>{


let x=d.data();



box.innerHTML+=`

<div class="player">

📦 ${x.item}

<br>

🏆 ${x.winner}

<br>

📄 หน้า ${x.page}

ชิ้น ${x.piece}

<br>

⏰ ${x.time}

</div>

`;



});


}







// ================= CLEAR =================


window.clearAll=async function(){


if(!confirm("ล้างรายชื่อทั้งหมด?"))

return;



let snap=
await getDocs(
collection(db,"bids")
);



for(let x of snap.docs){


await deleteDoc(

doc(db,"bids",x.id)

);


}



alert("ล้างแล้ว");


};
