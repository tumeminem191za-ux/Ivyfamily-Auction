import { db } from "./firebase.js";


import {

collection,

addDoc,

deleteDoc,

doc,

onSnapshot

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let data=[];




function auctionOpen(){


let now=new Date();


let time=
now.getHours()*60+
now.getMinutes();



return time>=1270 && time<=1300;


}





window.add=async function(){


if(!auctionOpen()){

alert("เปิดรับ 21:10-21:40");

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







window.removeBid=async function(){



let player=prompt("ใส่ชื่อผู้เล่น");


let target=data.find(x=>

x.name==player

);



if(!target){

alert("ไม่พบชื่อ");

return;

}



await deleteDoc(

doc(db,"bids",target.id)

);



alert("ถอนชื่อแล้ว");


};







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
