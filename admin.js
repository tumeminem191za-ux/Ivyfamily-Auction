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

let winner="";




// ======================
// LOGIN
// ======================

window.login=function(){


let pass=
document.getElementById("pass").value;


if(pass==="1234"){


document.getElementById("admin").style.display="block";


loadHistory();


}

else{

alert("รหัสผิด");

}

};





// ======================
// LOAD BIDS
// ======================


onSnapshot(

query(
collection(db,"bids"),
orderBy("time","asc")
),

snap=>{


data=[];


snap.forEach(d=>{


data.push({

id:d.id,

...d.data()

});


});


}

);







// ======================
// โหลดวงล้อ
// ======================


window.loadWheel=function(){


let item=
document.getElementById("wheelItem").value;



players=[

...new Set(

data
.filter(x=>x.item==item)
.map(x=>x.name)

)

];



let box=
document.getElementById("players");


box.innerHTML=


players.map(x=>


`
<div class="player">
👤 ${x}
</div>

`

).join("");



drawWheel();


};







// ======================
// วาดวงล้อ
// ======================


function drawWheel(){


let canvas=
document.getElementById("wheel");


let ctx=
canvas.getContext("2d");



let r=canvas.width/2;



ctx.clearRect(0,0,400,400);



if(players.length==0)return;



let size=
(2*Math.PI)/players.length;



players.forEach((name,i)=>{


let start=
angle+i*size;


ctx.beginPath();


ctx.moveTo(r,r);


ctx.arc(
r,
r,
r,
start,
start+size
);


ctx.fillStyle=

i%2==0?
"#8b5cf6":
"#d8b4ff";


ctx.fill();



ctx.save();


ctx.translate(r,r);


ctx.rotate(start+size/2);


ctx.fillStyle="#000";


ctx.font="16px sans-serif";


ctx.fillText(
name,
60,
5
);


ctx.restore();


});


}






// ======================
// หมุน
// ======================


window.spin=function(){


if(spinning)return;


if(players.length<2){

alert("ต้องมีคนแย่งอย่างน้อย 2 คน");

return;

}



spinning=true;



let speed=
Math.random()*0.3+0.25;


let total=
Math.PI*2*8+
Math.random()*Math.PI*2;



let start=angle;



let time=0;



function animate(){


time+=0.02;


angle=
start+
total*
(time);



drawWheel();



if(time<1){

requestAnimationFrame(animate);

}

else{


angle=
angle%(Math.PI*2);


drawWheel();


finishSpin();


}


}



animate();


};







// ======================
// จบการหมุน
// ======================


async function finishSpin(){



let index=

Math.floor(

(
2*Math.PI-angle
)

/

(
2*Math.PI/players.length
)

)

%players.length;



winner=
players[index];



let item=
document.getElementById("wheelItem").value;



let winData=
data.find(x=>

x.item==item &&
x.name==winner

);




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






// ======================
// ประวัติ
// ======================


async function loadHistory(){


let box=
document.getElementById("history");


if(!box)return;



let snap=

await getDocs(

query(

collection(db,"history"),

orderBy("time","desc")

)

);



box.innerHTML="";



snap.forEach(d=>{


let x=d.data();


box.innerHTML+=

`

<div class="player">

📦 ${x.item}

<br>

🏆 ${x.winner}

<br>

📄 ${x.page}

ชิ้น ${x.piece}

<br>

⏰ ${x.time}

</div>

`;


});


}







// ======================
// ล้างรายชื่อ
// ======================


window.clearAll=async function(){


if(!confirm("ล้างรายชื่อทั้งหมด?"))return;



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
