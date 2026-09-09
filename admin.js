import { db } from "./firebase.js";

import {
 collection,
 onSnapshot,
 addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];



// โหลดรายการประมูล

onSnapshot(collection(db,"bids"),(snap)=>{

 data=[];

 snap.forEach(doc=>{

  data.push(doc.data());

 });


 showList();

});




// แสดงรายการของที่มีคนแย่ง

function showList(){

 let box=document.getElementById("list");

 let group={};


 data.forEach(x=>{


  let key=
  x.item+" | "+x.page+" | ชิ้น "+x.piece;


  if(!group[key]){

   group[key]=[];

  }


  group[key].push(x.name);


 });



 box.innerHTML="";


 Object.keys(group).forEach(k=>{


  box.innerHTML += `

  <div class="card">

  <b>${k}</b><br>

  จำนวนคนแย่ง: ${group[k].length} คน<br>

  ${group[k].join(", ")}

  </div>

  `;


 });


}





// หมุนวงล้อ + บันทึกผล

window.wheel = async function(){


 let target=
 document.getElementById("target").value;



 let a=data

 .filter(x=>x.item==target)

 .map(x=>x.name);



 a=[...new Set(a)];



 if(a.length<2){


 document.getElementById("result").innerHTML=
 "ของชิ้นนี้ไม่มีคนแย่ง";


 return;


 }



 let winner=
 a[Math.floor(Math.random()*a.length)];



 document.getElementById("result").innerHTML=

 "ผู้ได้สิทธิ์: "+winner;



 // บันทึกประวัติ

 await addDoc(collection(db,"history"),{

  item:target,

  winner:winner,

  time:new Date().toLocaleString("th-TH")

 });


}




// โหลดประวัติ

onSnapshot(collection(db,"history"),(snap)=>{


 let h="";


 snap.forEach(doc=>{


 let x=doc.data();



 h += `

 <div class="card">

 ของ: ${x.item}<br>

 ผู้ชนะ: ${x.winner}<br>

 เวลา: ${x.time}

 </div>

 `;


 });



 document.getElementById("history").innerHTML=h;


});
