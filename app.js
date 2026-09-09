import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data = [];


// หารอบประมูลประจำสัปดาห์
function getAuctionWeek(){

 let now = new Date();

 // รอบเริ่มวันเสาร์
 let day = now.getDay();

 // ถ้าเป็นวันอาทิตย์ให้ย้อนกลับไปเสาร์
 let diff = day === 0 ? 1 : day + 1;

 let saturday = new Date();

 saturday.setDate(now.getDate() - diff);

 return saturday.toLocaleDateString("th-TH");

}



// ลงชื่อประมูล
window.add = async function(){

 let x = {

  name: document.getElementById("name").value,

  item: document.getElementById("item").value,

  page: document.getElementById("page").value,

  piece: document.getElementById("piece").value,

  week: getAuctionWeek(),

  time: Date.now()

 };


 if(!x.name){

  alert("กรุณาใส่ชื่อ");

  return;

 }


 await addDoc(collection(db,"bids"),x);


 alert("ลงชื่อแล้ว");


 document.getElementById("name").value="";
 document.getElementById("piece").value="";

};



// โหลดรายชื่อแบบ Real-time
onSnapshot(collection(db,"bids"),(snap)=>{


 data=[];


 snap.forEach(doc=>{


  let x = doc.data();


  // แสดงเฉพาะรอบปัจจุบัน
  if(x.week == getAuctionWeek()){

    data.push(x);

  }


 });


 render();


});



// แสดงรายชื่อ
function render(){


 let list=document.getElementById("list");


 list.innerHTML = data.map(x=>


 `${x.name} | ${x.item} | ${x.page} | ชิ้น ${x.piece}`


 ).join("<br>");

}



// วงล้อแอดมิน
window.wheel=function(){


 let target = prompt("ใส่ชื่อไอเทมที่จะหมุน");


 let a = [

  ...new Set(

   data

   .filter(x=>x.item==target)

   .map(x=>x.name)

  )

 ];


 if(a.length < 2){

  document.getElementById("result").innerHTML =
  "ไม่มีการแย่ง";

  return;

 }


 let winner =
 a[Math.floor(Math.random()*a.length)];


 document.getElementById("result").innerHTML =
 "ผู้ได้สิทธิ์: " + winner;


};
