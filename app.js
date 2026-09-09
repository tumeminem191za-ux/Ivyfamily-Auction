import { db } from "./firebase.js";


import {

collection,

addDoc,

onSnapshot,

query,

orderBy,

getDocs,

deleteDoc,

doc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



let data=[];




function getWeek(){

let now=new Date();

let day=now.getDay();

let diff=now.getDate()-day;


let sunday=new Date(now.setDate(diff));


return sunday.toLocaleDateString("th-TH");

}




function status(){


let now=new Date();


let t=
now.getHours()*60+
now.getMinutes();



let box=document.getElementById("status");



if(t>=1260 && t<1270){

box.innerHTML="สถานะ: เปิดรับชื่อ";

}

else if(t>=1270 && t<1300){

box.innerHTML="สถานะ: ล็อกชื่อ";

}

else{

box.innerHTML="สถานะ: ปิด";

}


}


setInterval(status,1000);

status();







window.add=async function(){


let x={


name:name.value,

item:item.value,

page:page.value,

piece:piece.value,

week:getWeek(),

time:Date.now()


};




let same=data.find(a=>

a.name==x.name &&

a.item==x.item &&

a.page==x.page &&

a.piece==x.piece

);



if(same){

alert("ลงของชิ้นนี้แล้ว");

return;

}




await addDoc(collection(db,"bids"),x);


alert("ลงชื่อแล้ว");


};






onSnapshot(

query(collection(db,"bids"),orderBy("time","asc")),

snap=>{


data=[];


snap.forEach(d=>{


data.push({

id:d.id,

...d.data()

});


});


render();


});








function render(){


list.innerHTML=data.map(x=>

`

<div>

${x.name} |

${x.item} |

${x.page} |

ชิ้น ${x.piece}

</div>

`

).join("");


}






window.showMyList=function(){


let n=myname.value;


let a=data.filter(x=>x.name==n);



mylist.innerHTML=a.map(x=>

`

<div>

${x.item}
${x.page}
ชิ้น ${x.piece}

</div>

`

).join("");


}






window.wheel=function(){


let target=prompt("ชื่อไอเทม");


let a=[...new Set(

data
.filter(x=>x.item==target)
.map(x=>x.name)

)];



if(a.length<2){

result.innerHTML="ไม่มีคนแย่ง";

return;

}



let w=a[Math.floor(Math.random()*a.length)];


result.innerHTML="ผู้ได้สิทธิ์: "+w;


};






// ปุ่มล้างแอดมิน

window.clearAll=async function(){


if(!confirm("ล้างรายชื่อทั้งหมด?")) return;



let snap=await getDocs(collection(db,"bids"));



snap.forEach(async x=>{


await deleteDoc(
doc(db,"bids",x.id)
);


});


alert("ล้างแล้ว");


};






// ล้างอัตโนมัติ อาทิตย์ 04:00

async function autoClear(){


let now=new Date();



if(

now.getDay()==0 &&

now.getHours()==4 &&

now.getMinutes()==0

){



let snap=await getDocs(collection(db,"bids"));



snap.forEach(async x=>{


await deleteDoc(
doc(db,"bids",x.id)
);


});


}


}



setInterval(autoClear,60000);
