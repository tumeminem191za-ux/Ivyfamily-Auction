import { db } from "./firebase.js";


import {

collection,

onSnapshot

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let data=[];



let password="1234";



// login

window.login=function(){


let p=document.getElementById("pass").value;


if(p==password){


document.getElementById("panel").style.display="block";


}

else{

alert("รหัสผิด");

}


}




// โหลดรายชื่อ

onSnapshot(collection(db,"bids"),(snap)=>{


data=[];


snap.forEach(doc=>{


data.push(doc.data());


});


});





// วงล้อ

window.wheel=function(){



let target=prompt(
"ใส่ชื่อไอเทม"
);



let a=[

...new Set(

data

.filter(x=>x.item==target)

.map(x=>x.name)

)

];



if(a.length<2){


document.getElementById("result").innerHTML=
"ไม่มีการแย่ง";


return;


}




let winner=

a[Math.floor(Math.random()*a.length)];



document.getElementById("result").innerHTML=

"ผู้ได้สิทธิ์: "+winner;



}
