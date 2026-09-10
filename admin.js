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




// โหลดข้อมูล

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





// โหลดคนลงชื่อ

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


document.getElementById("players").innerHTML=


players.map(x=>`

<div class="player">
👤 ${x}
</div>

`).join("");



drawWheel();


};






// วาดวงล้อใหม่

function drawWheel(){


let canvas=document.getElementById("wheel");

let ctx=canvas.getContext("2d");


let r=canvas.width/2;


ctx.clearRect(0,0,400,400);



if(players.length==0)return;



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


let start=angle+i*size;



// ช่องวงล้อ

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
colors[i%colors.length];


ctx.fill();



ctx.lineWidth=3;

ctx.strokeStyle="#ffffff";

ctx.stroke();





// ชื่อ

ctx.save();


ctx.translate(r,r);


ctx.rotate(start+size/2);



ctx.fillStyle="#ffffff";


ctx.shadowColor="#000";

ctx.shadowBlur=6;


ctx.font="bold 16px sans-serif";


ctx.fillText(
name,
70,
5
);



ctx.restore();


ctx.shadowBlur=0;



});




// วงกลาง

ctx.beginPath();

ctx.arc(
r,
r,
45,
0,
Math.PI*2
);


ctx.fillStyle="#111";

ctx.fill();



ctx.fillStyle="#ffffff";

ctx.font="bold 20px sans-serif";

ctx.textAlign="center";

ctx.fillText(
"IVY",
r,
r+7
);



}







// หมุน

window.spin=function(){


if(spinning)return;


if(players.length<2){

alert("ต้องมีคนแย่งอย่างน้อย 2 คน");

return;

}



spinning=true;



let start=angle;


let total=
Math.PI*2*8+
Math.random()*Math.PI*2;



let t=0;



function animate(){


t+=0.02;


angle=start+(total*t);



drawWheel();



if(t<1){

requestAnimationFrame(animate);

}

else{


angle%=Math.PI*2;


drawWheel();


finishSpin();


}


}



animate();


};







// จบการหมุน

async function finishSpin(){



let size=(Math.PI*2)/players.length;


let index=Math.floor(

((Math.PI*2-angle)%(Math.PI*2))
/
size

);



let winner=players[index];



let item=
document.getElementById("wheelItem").value;



let winData=data.find(x=>

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







// ประวัติ

async function loadHistory(){


let box=document.getElementById("history");


if(!box)return;



let snap=await getDocs(

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

📄 ${x.page}

ชิ้น ${x.piece}

<br>

⏰ ${x.time}

</div>

`;


});


}







// ล้างรายชื่อ

window.clearAll=async function(){


if(!confirm("ล้างรายชื่อทั้งหมด?"))return;



let snap=
await getDocs(collection(db,"bids"));



for(let x of snap.docs){


await deleteDoc(

doc(db,"bids",x.id)

);


}



alert("ล้างแล้ว");


};
