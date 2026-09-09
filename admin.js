import { db } from "./firebase.js";

import {
 collection,
 getDocs,
 deleteDoc,
 doc,
 onSnapshot,
 query,
 orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


// ===== LOGIN ADMIN =====

window.login=function(){

let pass=document.getElementById("pass").value;


if(pass==="1234"){

document.getElementById("admin").style.display="block";

alert("เข้าสู่ระบบสำเร็จ");

load();

}

else{

alert("รหัสผิด");

}

};



// ===== โหลดข้อมูล REALTIME =====

onSnapshot(
query(collection(db,"bids"),orderBy("time","asc")),
(snap)=>{

data=[];

snap.forEach(d=>{

data.push({

id:d.id,
...d.data()

});

});


});




// ===== โหลดข้อมูล =====

async function load(){

let snap=await getDocs(collection(db,"bids"));

data=[];


snap.forEach(d=>{

data.push({

id:d.id,
...d.data()

});

});


}



// ===== วงล้อ =====

window.wheel=function(){


let target=prompt("ใส่ชื่อไอเทม");


let list=[

...new Set(

data
.filter(x=>x.item==target)
.map(x=>x.name)

)

];



if(list.length<2){

document.getElementById("result").innerHTML=
"ไม่มีคนแย่ง";

return;

}



let winner=
list[Math.floor(Math.random()*list.length)];



document.getElementById("result").innerHTML=
"ผู้ได้สิทธิ์: "+winner;


};




// ===== ล้างรายชื่อด้วยมือ =====

window.clearAll=async function(){


let ok=confirm("ต้องการล้างรายชื่อทั้งหมดไหม");


if(!ok)return;



let snap=await getDocs(collection(db,"bids"));



for(let d of snap.docs){

await deleteDoc(
doc(db,"bids",d.id)
);

}



alert("ล้างรายชื่อแล้ว");


};




// ===== ล้างอัตโนมัติ ทุกวันอาทิตย์ 04:00 =====

async function autoClear(){


let now=new Date();



if(
now.getDay()==0 &&
now.getHours()==4 &&
now.getMinutes()==0
){


let snap=await getDocs(collection(db,"bids"));



for(let d of snap.docs){

await deleteDoc(
doc(db,"bids",d.id)
);

}


}


}



setInterval(autoClear,60000);
