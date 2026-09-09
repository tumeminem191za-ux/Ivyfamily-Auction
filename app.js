import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// เช็กเวลาประมูล
function auctionOpen(){

 let now=new Date();

 let hour=now.getHours();

 let minute=now.getMinutes();


 let time=hour*60+minute;


 let start=21*60;

 let end=21*60+40;


 return time>=start && time<=end;

}



// รอบประมูลประจำสัปดาห์
function getAuctionWeek(){

 let now=new Date();

 let day=now.getDay();

 let diff=day===0?1:day+1;


 let saturday=new Date();

 saturday.setDate(now.getDate()-diff);


 return saturday.toLocaleDateString("th-TH");

}



// ลงชื่อ
window.add=async function(){


 if(!auctionOpen()){

  alert("ยังไม่ถึงเวลา หรือปิดประมูลแล้ว\nเปิด 21:00-21:40");

  return;

 }



 let x={


 name:document.getElementById("name").value,


 item:document.getElementById("item").value,


 page:document.getElementById("page").value,


 piece:document.getElementById("piece").value,


 week:getAuctionWeek(),


 time:Date.now()


 };



 if(!x.name){

  alert("กรุณาใส่ชื่อ");

  return;

 }



 await addDoc(collection(db,"bids"),x);



 alert("ลงชื่อเรียบร้อย");


 document.getElementById("name").value="";

 document.getElementById("piece").value="";


}




// โหลดข้อมูลสด

onSnapshot(collection(db,"bids"),(snap)=>{


 data=[];


 snap.forEach(doc=>{


  let x=doc.data();


  if(x.week==getAuctionWeek()){

   data.push(x);

  }


 });



 render();


});




// แสดงรายชื่อ

function render(){


 document.getElementById("list").innerHTML=


 data.map(x=>


 `${x.name} | ${x.item} | ${x.page} | ชิ้น ${x.piece}`


 ).join("<br>");

}
