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
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let data=[];
let players=[];
let angle=0;
let spinning=false;
let selectedWinner=null;



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





// ================= REALTIME BID =================


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






// ================= DRAW WHEEL =================


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



let size=(Math.PI*2)/players.length;



players.forEach((name,i)=>{


let start=angle+(i*size);



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

ctx.stroke();



ctx.save();


ctx.translate(r,r);

ctx.rotate(start+size/2);


ctx.fillStyle="white";

ctx.font="bold 16px sans-serif";


ctx.fillText(
name,
90,
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


ctx.fillStyle="gold";

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


ctx.fillStyle="gold";

ctx.fill();


}








// ================= SPIN =================


window.spin=function(){


if(spinning)return;


if(players.length<2){

alert("โหลดรายชื่อก่อน");

return;

}


spinning=true;



selectedWinner=

players[
Math.floor(Math.random()*players.length)
];



let index=
players.indexOf(selectedWinner);



let size=
(Math.PI*2)/players.length;



let target=

(
-(index*size)
-
(size/2)
+
Math.PI/2
);



let start=angle;



let rotate=

(Math.PI*2*8)

+

(target-angle%(Math.PI*2));



let startTime=null;

let duration=7000;




function animate(t){


if(!startTime)

startTime=t;



let p=(t-startTime)/duration;


if(p>1)p=1;



let ease=
1-Math.pow(1-p,5);



angle=
start+(rotate*ease);



drawWheel();



if(p<1){

requestAnimationFrame(animate);

}

else{


angle=target;

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


let winner=selectedWinner;



let winData=

data.find(x=>

x.item===item &&
x.name===winner

);





winnerBox.style.display="block";


winnerName.innerHTML=

"🏆 "+winner;



winnerItem.innerHTML=

`

📦 ${item}

<br>

📄 หน้า ${winData?.page || "-"}

ชิ้น ${winData?.piece || "-"}

`;



result.innerHTML=

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

selectedWinner=null;


}







window.closeWinner=function(){

winnerBox.style.display="none";

};







// ================= HISTORY =================


async function loadHistory(){


let box=document.getElementById("history");


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







// ================= SEARCH =================


window.searchHistory=function(){


let key=

document.getElementById("searchHistory")
.value
.toLowerCase();



let box=document.getElementById("history");


box.innerHTML="";



data.filter(x=>


x.name.toLowerCase().includes(key)

||

x.item.toLowerCase().includes(key)


)

.forEach(x=>{


box.innerHTML+=`

<div class="player">

👤 ${x.name}

<br>

📦 ${x.item}

<br>

📄 หน้า ${x.page}

ชิ้น ${x.piece}

</div>

`;

});


};







// ================= CLEAR BID =================


window.clearAll=async function(){


if(!confirm("ล้างรายชื่อประมูลทั้งหมด?"))

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



alert("ล้างรายชื่อแล้ว");


};







// ================= CLEAR HISTORY =================


window.clearHistory=async function(){


if(!confirm("ล้างประวัติผู้ชนะทั้งหมด?"))

return;



let snap=

await getDocs(
collection(db,"history")
);



for(let x of snap.docs){


await deleteDoc(

doc(db,"history",x.id)

);


}



document.getElementById("history").innerHTML="";


alert("ล้างประวัติแล้ว");


};
