import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot,
 query,
 orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// ======================
// เช็กเวลา
// ======================

function status(){

let now=new Date();

let time=
now.getHours()*60+
now.getMinutes();


let box=document.getElementById("status");

if(!box)return;


if(time>=1260 && time<1270){

box.innerHTML="🟢 เปิดรับชื่อ";

}

else if(time>=1270 && time<1300){

box.innerHTML="🟡 กำลังประมูล";

}

else{

box.innerHTML="🔴 ปิดรับชื่อ";

}

}


setInterval(status,1000);

status();




// ======================
// ลงชื่อ
// ======================

window.add=async function(){


let x={


name:document.getElementById("name").value,

item:document.getElementById("item").value,

page:document.getElementById("page").value,

piece:document.getElementById("piece").value,


time:Date.now(),


registerTime:
new Date().toLocaleTimeString("th-TH")


};



if(x.name==""){

alert("กรุณาใส่ชื่อ");

return;

}





let same=data.find(a=>

a.name==x.name &&

a.item==x.item &&

a.page==x.page &&

a.piece==x.piece

);



if(same){

alert("ลงรายการนี้แล้ว");

return;

}




await addDoc(
collection(db,"bids"),
x
);



alert("ลงชื่อแล้ว");



document.getElementById("name").value="";

document.getElementById("piece").value="";


};




// ======================
// realtime
// ======================

onSnapshot(

query(
collection(db,"bids"),
orderBy("time","asc")
),

snap=>{


data=[];


snap.forEach(doc=>{


data.push({

id:doc.id,

...doc.data()

});


});



render();


}

);






// ======================
// แสดงผล
// ======================


function render(){


let list=document.getElementById("list");


if(!list)return;



// จำนวนรายการ

let count=document.getElementById("count");

if(count){

count.innerHTML=data.length;

}



// จำนวนคน

let people=document.getElementById("people");

if(people){

let names=[

...new Set(
data.map(x=>x.name)
)

];


people.innerHTML=names.length;


}




// แยกตามไอเทม

let group={};



data.forEach(x=>{


if(!group[x.item]){

group[x.item]=[];

}


group[x.item].push(x);


});




list.innerHTML=
Object.keys(group).map(item=>{


return `

<div class="item">


<h3>📦 ${item}</h3>


${
group[item].map(x=>

`

<div>

👤 <span class="name">${x.name}</span>

<br>

📄 ${x.page}

| ชิ้น ${x.piece}

<br>

⏰ ${x.registerTime || "-"}

</div>

<hr>

`

).join("")
}


</div>


`;


}).join("");



}





// ======================
// ดูรายการของฉัน
// ======================


window.showMyList=function(){


let n=
document.getElementById("myname").value;


let a=
data.filter(x=>x.name==n);



document.getElementById("mylist").innerHTML=


a.map(x=>

`

<div class="item">

📦 ${x.item}

<br>

${x.page}

| ชิ้น ${x.piece}

<br>

⏰ ${x.registerTime || "-"}

</div>

`

).join("");



};
