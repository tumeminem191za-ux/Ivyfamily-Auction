import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];



// เช็กเวลาเปิดประมูล

function auctionOpen(){

 let now=new Date();

 let time=now.getHours()*60+now.getMinutes();

 let start=21*60;

 let end=21*60+40;


 return time>=start && time<=end;

}



// รอบประมูล

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

 alert("เปิดรับเฉพาะเวลา 21:00-21:40");

 return;

 }



 let name=
 document.getElementById("name").value;



 let item=
 document.getElementById("item").value;



 let page=
 document.getElementById("page").value;



 let piece=
 document.getElementById("piece").value;



 if(!name){

 alert("กรุณาใส่ชื่อ");

 return;

 }



 // กันลงซ้ำของชิ้นเดิม

 let duplicate=data.some(x=>

 x.name==name &&

 x.item==item &&

 x.page==page &&

 x.piece==piece

 );



 if(duplicate){

 alert("คุณลงชื่อของชิ้นนี้แล้ว");

 return;

 }




 let x={


 name:name,

 item:item,

 page:page,

 piece:piece,

 week:getAuctionWeek(),

 time:Date.now()


 };



 await addDoc(collection(db,"bids"),x);



 alert("ลงชื่อเรียบร้อย");


 document.getElementById("name").value="";

 document.getElementById("piece").value="";


};






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
