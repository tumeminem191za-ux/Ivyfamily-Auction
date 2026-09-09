import { db } from "./firebase.js";


import {

collection,

getDocs,

deleteDoc,

doc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let password="1234";

let data=[];



window.login=function(){


if(pass.value==password){


admin.style.display="block";


load();


}

else{

alert("รหัสผิด");

}


}




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




window.clearAll=async function(){


if(!confirm("ล้างทั้งหมด?")) return;



let snap=await getDocs(collection(db,"bids"));


snap.forEach(async x=>{


await deleteDoc(
doc(db,"bids",x.id)
);


});


alert("ล้างแล้ว");


}





window.wheel=function(){


let item=prompt("ใส่ชื่อไอเทม");


let list=[...new Set(

data
.filter(x=>x.item==item)
.map(x=>x.name)

)];



if(list.length<2){

result.innerHTML="ไม่มีคนแย่ง";

return;

}



let win=list[Math.floor(Math.random()*list.length)];

result.innerHTML="ผู้ได้สิทธิ์: "+win;


}
