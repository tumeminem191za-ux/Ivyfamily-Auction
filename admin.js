import { db } from "./firebase.js";

import {
 collection,
 onSnapshot,
 addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];



// โหลดข้อมูลประมูล

onSnapshot(collection(db,"bids"),(snap)=>{


data=[];


snap.forEach(doc=>{

data.push(doc.data());

});


showList();


});





// แสดงรายการของ

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


let count=group[k].length;



box.innerHTML += `


<div class="card">


<b>${k}</b><br>


คนแย่ง: ${count} คน


<br>


<button onclick="wheel('${k}')">

หมุนชิ้นนี้

</button>


</div>


`;



});


}





// หมุน

window.wheel=async function(target){



let a=data

.filter(x=>

(x.item+" | "+x.page+" | ชิ้น "+x.piece)==target

)

.map(x=>x.name);



a=[...new Set(a)];



if(a.length<2){


document.getElementById("result").innerHTML=

"ไม่มีคนแย่ง";


return;

}



let winner=

a[Math.floor(Math.random()*a.length)];



document.getElementById("result").innerHTML=

"ผู้ได้สิทธิ์: "+winner;



await addDoc(collection(db,"history"),{


item:target,


winner:winner,


time:new Date().toLocaleString("th-TH")


});



}





// ประวัติ

onSnapshot(collection(db,"history"),(snap)=>{


let h="";



snap.forEach(doc=>{


let x=doc.data();


h += `

<div class="card">

${x.item}<br>

ผู้ชนะ: ${x.winner}<br>

เวลา: ${x.time}

</div>

`;



});



document.getElementById("history").innerHTML=h;



});
