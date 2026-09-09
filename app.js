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




window.add=async function(){


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



window.showMyList=function(){


let n=myname.value;


let box=document.getElementById("mylist");


let arr=data.filter(x=>x.name==n);



if(arr.length==0){

box.innerHTML="ไม่พบรายการ";

return;

}




box.innerHTML="";



arr.forEach(x=>{


box.innerHTML+=`

<div class="card">

${x.item}<br>

${x.page} | ชิ้น ${x.piece}

<br>

<button onclick="removeBid('${x.id}')">

ถอนรายการนี้

</button>


</div>

`;


});


};







window.removeBid=async function(id){


await deleteDoc(

doc(db,"bids",id)

);


alert("ถอนรายการแล้ว");


};
