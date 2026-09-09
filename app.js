import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 deleteDoc,
 doc,
 onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];



// เช็กสถานะเวลา

function auctionStatus(){

 let now=new Date();

 let t=
 now.getHours()*60+
 now.getMinutes();


 // 21:00
 let open=21*60;


 // 21:10
 let lock=21*60+10;


 // 21:40
 let close=21*60+40;



 if(t<open){

  return "ยังไม่เปิด";

 }


 if(t>=open && t<lock){

  return "เปิดรับชื่อ";

 }


 if(t>=lock && t<close){

  return "ล็อกชื่อแล้ว";

 }


 return "ปิดประมูล";

}





// แสดงสถานะเวลา

function showStatus(){


let box=document.getElementById("status");


if(box){

box.innerHTML=
"สถานะ: "+auctionStatus();

}


}


setInterval(showStatus,1000);

showStatus();






// ลงชื่อ

window.add=async function(){



if(auctionStatus()!="เปิดรับชื่อ"){

alert("ตอนนี้ไม่เปิดรับชื่อแล้ว");

return;

}



let x={


name:name.value,

item:item.value,

page:page.value,

piece:piece.value,

time:Date.now()


};




let same=data.find(a=>

a.name==x.name &&

a.item==x.item &&

a.page==x.page &&

a.piece==x.piece

);



if(same){

alert("คุณลงของชิ้นนี้แล้ว");

return;

}



await addDoc(collection(db,"bids"),x);



alert("ลงชื่อแล้ว");


};







// ถอนชื่อ

window.removeBid=async function(id){



if(auctionStatus()!="เปิดรับชื่อ"){

alert("หมดเวลาถอนชื่อแล้ว");

return;

}



await deleteDoc(

doc(db,"bids",id)

);


alert("ถอนรายการแล้ว");


};







// โหลดข้อมูล

onSnapshot(collection(db,"bids"),(snap)=>{


data=[];


snap.forEach(doc=>{


let x=doc.data();

x.id=doc.id;


data.push(x);


});



render();


});







function render(){


list.innerHTML=data.map(x=>


`${x.name} | ${x.item} | ${x.page} | ชิ้น ${x.piece}`


).join("<br>");



}
