import { db } from "./firebase.js";


import {

collection,
onSnapshot,
query,
orderBy,
getDocs,
deleteDoc,
doc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let data=[];


// ======================
// LOGIN
// ======================

window.login=function(){


let pass=
document.getElementById("pass").value;



if(pass==="1234"){


document.getElementById("admin").style.display="block";


alert("เข้าสู่ระบบสำเร็จ");


}

else{


alert("รหัสผิด");


}


};




// ======================
// REALTIME
// ======================


onSnapshot(

query(
collection(db,"bids"),
orderBy("time","asc")
),

snap=>{


data=[];


snap.forEach(d=>{


data.push({

id:d.id,

...d.data()

});


});



let count=
document.getElementById("count");


if(count){

count.innerHTML=data.length;

}



}

);






// ======================
// แสดงคนแย่ง
// ======================


window.showWheelList=function(){


let item=
document.getElementById("wheelItem").value;



let players=[


...new Set(


data

.filter(x=>x.item==item)

.map(x=>x.name)


)


];




let box=
document.getElementById("wheelList");



if(players.length==0){


box.innerHTML=
"ไม่มีคนลงชื่อ";


return;


}




box.innerHTML=


players.map(x=>

`

<div class="item">

👤 ${x}

</div>

`

).join("");



};







// ======================
// หมุนวงล้อ
// ======================


window.wheel=function(){


let item=
document.getElementById("wheelItem").value;



let players=[


...new Set(

data

.filter(x=>x.item==item)

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

Math.floor(
Math.random()*players.length
)

];




document.getElementById("result").innerHTML=


"🎉 ผู้ได้สิทธิ์: "+winner;



};







// ======================
// ล้างรายชื่อ
// ======================


window.clearAll=async function(){



let ok=
confirm("ต้องการล้างรายชื่อทั้งหมดไหม");



if(!ok)return;



let snap=
await getDocs(collection(db,"bids"));



for(let d of snap.docs){


await deleteDoc(

doc(db,"bids",d.id)

);


}



alert("ล้างรายชื่อแล้ว");


};
