import { db } from "./firebase.js";


import {
 collection,
 getDocs,
 deleteDoc,
 doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data=[];


const ADMIN_PASSWORD = "1234";



// เข้าระบบ

window.login=function(){


let input=document.getElementById("pass").value;


if(input===ADMIN_PASSWORD){


document.getElementById("admin").style.display="block";


alert("เข้าสู่ระบบแล้ว");


load();


}
else{


alert("รหัสผิด");


}


};




// โหลดข้อมูล

async function load(){


data=[];


let snap=await getDocs(collection(db,"bids"));


snap.forEach(x=>{


data.push({

id:x.id,

...x.data()

});


});


}






// ล้างรายชื่อ

window.clearAll=async function(){


let ok=confirm("ต้องการล้างรายชื่อทั้งหมดไหม");


if(!ok)return;



let snap=await getDocs(collection(db,"bids"));



for(let x of snap.docs){


await deleteDoc(
doc(db,"bids",x.id)
);


}



alert("ล้างรายชื่อแล้ว");


};





// หมุนวงล้อ

window.wheel=function(){


let item=prompt("ใส่ชื่อไอเทม");


let list=[...new Set(

data
.filter(x=>x.item==item)
.map(x=>x.name)

)];



if(list.length<2){

document.getElementById("result").innerHTML="ไม่มีคนแย่ง";

return;

}



let win=list[Math.floor(Math.random()*list.length)];


document.getElementById("result").innerHTML=
"ผู้ได้สิทธิ์: "+win;


};
