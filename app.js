import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot,
 query,
 orderBy,
 getDocs,
 deleteDoc,
 doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// หาอาทิตย์ของรอบประมูล
function getWeek(){

let now=new Date();

let day=now.getDay();

let diff=now.getDate()-day;

let sunday=new Date(now.setDate(diff));


return sunday.toLocaleDateString("th-TH");

}



// ลงชื่อ
window.add=async function(){


let name=document.getElementById("name").value;

let item=document.getElementById("item").value;

let page=document.getElementById("page").value;

let piece=document.getElementById("piece").value;



// กันชื่อเดิม + ของเดิม

let check=data.find(x=>

x.name==name &&
x.item==item &&
x.week==getWeek()

);



if(check){

alert("คุณลงชื่อไอเทมนี้แล้ว");

return;

}



await addDoc(collection(db,"bids"),{

name:name,
item:item,
page:page,
piece:piece,
week:getWeek(),
time:Date.now()

});



document.getElementById("name").value="";

document.getElementById("piece").value="";


}



// โหลด Real-time

onSnapshot(

query(collection(db,"bids"),orderBy("time","asc")),

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




// แสดงทั้งหมด

function render(){


document.getElementById("list").innerHTML=

data.map(x=>`

<div>

${x.name}
|
${x.item}
|
${x.page}
|
ชิ้น ${x.piece}

</div>

`).join("");

}



// ดูรายการตัวเอง

window.showMyList=function(){


let n=document.getElementById("myname").value;


let result=data.filter(x=>x.name==n);



document.getElementById("mylist").innerHTML=

result.map(x=>`

<div>

${x.item}
|
${x.page}
|
ชิ้น ${x.piece}

</div>

`).join("");


}




// วงล้อ

window.wheel=function(){


let target=prompt("ใส่ชื่อไอเทม");


let players=[

...new Set(

data
.filter(x=>x.item==target)
.map(x=>x.name)

)

];


if(players.length<2){

result.innerHTML="ไม่มีคนแย่ง";

return;

}



let winner=

players[Math.floor(Math.random()*players.length)];



result.innerHTML=

"ผู้ได้สิทธิ์: "+winner;


}




// ล้างข้อมูลทุกวันอาทิตย์ 04:00

async function autoClear(){


let now=new Date();


// วันอาทิตย์ = 0

if(

now.getDay()==0 &&

now.getHours()==4

){



let snap=await getDocs(collection(db,"bids"));


snap.forEach(async(x)=>{


await deleteDoc(doc(db,"bids",x.id));


});


console.log("ล้างรายการแล้ว");


}


}



// เช็กทุก 1 นาที

setInterval(autoClear,60000);
