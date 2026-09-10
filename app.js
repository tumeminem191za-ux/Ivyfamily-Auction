import { db } from "./firebase.js";

import {
 collection,
 addDoc,
 onSnapshot,
 query,
 orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// =======================
// เช็กเวลาไทย
// =======================

function getThaiTime(){

return new Date(
new Date().toLocaleString("en-US",
{
timeZone:"Asia/Bangkok"
})
);

}



// =======================
// สถานะ
// =======================

function status(){

let now=getThaiTime();

let t=
now.getHours()*60+
now.getMinutes();



let box=document.getElementById("status");

if(!box)return;



if(t>=1260 && t<1270){

box.innerHTML="🟢 เปิดรับชื่อ";

}

else if(t>=1270 && t<1300){

box.innerHTML="🟡 กำลังประมูล";

}

else{

box.innerHTML="🔴 ปิดรอบ";

}


}


setInterval(status,1000);

status();




// =======================
// หาอาทิตย์
// =======================

function getWeek(){

let now=getThaiTime();

let day=now.getDay();

let diff=now.getDate()-day;


let sunday=new Date(now.setDate(diff));


return sunday.toLocaleDateString("th-TH");

}





// =======================
// ส่งชื่อ
// =======================

window.add=async function(){



let now=getThaiTime();


let minute=
now.getHours()*60+
now.getMinutes();



if(minute<1260 || minute>=1270){

alert("หมดเวลาลงชื่อแล้ว");

return;

}





let x={


name:document.getElementById("name").value,

item:document.getElementById("item").value,

page:document.getElementById("page").value,

piece:document.getElementById("piece").value,


week:getWeek(),


// เวลาจริงที่ลง

time:Date.now(),


registerTime:

now.toLocaleTimeString("th-TH")



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






// =======================
// Real-time
// =======================

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






// =======================
// แสดงรายชื่อ
// =======================

function render(){


let list=document.getElementById("list");


if(!list)return;



list.innerHTML=data.map(x=>


`

<div class="item">

<b>👤 ${x.name}</b>

<br>

📦 ${x.item}

<br>

📄 ${x.page}

<br>

🔹 ชิ้น ${x.piece}

<br>

⏰ ลงชื่อเวลา ${x.registerTime || "-"}


</div>


`

).join("");



}







// =======================
// ดูรายการตัวเอง
// =======================

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

<br>

ชิ้น ${x.piece}

<br>

⏰ ${x.registerTime}

</div>

`

).join("");


};
