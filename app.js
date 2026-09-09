import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot,
 query,
 orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// =======================
// สถานะเวลา
// =======================

function status(){

let now=new Date();

let time =
now.getHours()*60+
now.getMinutes();


let box=document.getElementById("status");


if(!box) return;


if(time>=1260 && time<1270){

box.innerHTML="สถานะ: เปิดรับชื่อ";

}

else if(time>=1270 && time<1300){

box.innerHTML="สถานะ: กำลังประมูล";

}

else{

box.innerHTML="สถานะ: ปิด";

}

}


setInterval(status,1000);

status();





// =======================
// ลงชื่อประมูล
// =======================

window.add=async function(){


let name=
document.getElementById("name").value;


let item=
document.getElementById("item").value;


let page=
document.getElementById("page").value;


let piece=
document.getElementById("piece").value;



if(name==""){

alert("กรุณาใส่ชื่อ");

return;

}



// กันชื่อ + ไอเทม + หน้า + ชิ้น ซ้ำ

let check=data.find(x=>

x.name==name &&
x.item==item &&
x.page==page &&
x.piece==piece

);



if(check){

alert("คุณลงรายการนี้แล้ว");

return;

}



await addDoc(
collection(db,"bids"),
{

name:name,

item:item,

page:page,

piece:piece,

week:getWeek(),

time:Date.now()

}

);



alert("ลงชื่อเรียบร้อย");



document.getElementById("name").value="";

document.getElementById("piece").value="";


};





// =======================
// หาอาทิตย์ของรอบ
// =======================

function getWeek(){

let now=new Date();

let day=now.getDay();

let diff=
now.getDate()-day;


let sunday=
new Date(now.setDate(diff));


return sunday.toLocaleDateString("th-TH");

}





// =======================
// Real-time Firebase
// =======================


onSnapshot(

query(
collection(db,"bids"),
orderBy("time","asc")
),

(snapshot)=>{


data=[];


snapshot.forEach(doc=>{


data.push({

id:doc.id,

...doc.data()

});


});



render();


}

);





// =======================
// แสดงรายชื่อ
// =======================


function render(){


let list=
document.getElementById("list");


if(!list) return;



list.innerHTML=

data.map(x=>

`

<div>

${x.name}
|
${x.item}
|
${x.page}
|
ชิ้น ${x.piece}

</div>

`

).join("");



}





// =======================
// ดูรายการของตัวเอง
// =======================


window.showMyList=function(){


let n=
document.getElementById("myname").value;


let result=
data.filter(x=>x.name==n);



document.getElementById("mylist").innerHTML=


result.map(x=>

`

<div>

${x.item}
|
${x.page}
|
ชิ้น ${x.piece}

</div>

`

).join("");



}





// =======================
// วงล้อ (สำรอง)
// =======================


window.wheel=function(){


let target=
prompt("ใส่ชื่อไอเทม");



let players=[

...new Set(

data
.filter(x=>x.item==target)
.map(x=>x.name)

)

];



if(players.length<2){

document.getElementById("result").innerHTML=
"ไม่มีคนแย่ง";


return;

}



let winner=

players[
Math.floor(
Math.random()*players.length
)
];



document.getElementById("result").innerHTML=

"ผู้ได้สิทธิ์: "+winner;



};
