import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot,
 query,
 orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// ลงชื่อ
window.add = async function(){

let name=document.getElementById("name").value;
let item=document.getElementById("item").value;
let page=document.getElementById("page").value;
let piece=document.getElementById("piece").value;


// กันชื่อเดิม + ไอเทมเดิม
let check=data.find(x =>
x.name==name &&
x.item==item
);


if(check){

alert("ชื่อนี้ลงไอเทมนี้แล้ว");

return;

}


await addDoc(collection(db,"bids"),{

name:name,
item:item,
page:page,
piece:piece,
time:Date.now()

});


document.getElementById("name").value="";
document.getElementById("piece").value="";

}



// realtime

onSnapshot(
query(collection(db,"bids"),orderBy("time","asc")),
(snapshot)=>{


data=[];


snapshot.forEach(doc=>{

data.push(doc.data());

});


render();


});




// แสดงรายชื่อ

function render(){


document.getElementById("list").innerHTML=

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




// วงล้อ

window.wheel=function(){


let target=prompt(
"ใส่ชื่อไอเทมที่จะหมุน"
);



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
Math.floor(Math.random()*players.length)
];



document.getElementById("result").innerHTML=

"ผู้ได้สิทธิ์: "+winner;


}
