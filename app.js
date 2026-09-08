import { db } from "./firebase.js";
import { 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let data=[];

window.add = async function(){

 let x={
  name: document.getElementById("name").value,
  item: document.getElementById("item").value,
  page: document.getElementById("page").value,
  piece: document.getElementById("piece").value
 };

 await addDoc(collection(db,"bids"),x);

 alert("ลงชื่อแล้ว");
 load();
}


async function load(){

 data=[];

 let snap=await getDocs(collection(db,"bids"));

 snap.forEach(doc=>{
   data.push(doc.data());
 });

 render();
}


function render(){

 document.getElementById("list").innerHTML =
 data.map(x=>
 `${x.name} | ${x.item} | ${x.page} | ชิ้น ${x.piece}`
 ).join("<br>");

}


window.wheel=function(){

 let target=prompt("ใส่ชื่อไอเทมที่จะหมุน");

 let a=[
 ...new Set(
  data
  .filter(x=>x.item==target)
  .map(x=>x.name)
 )
 ];

 if(a.length<2){
  document.getElementById("result").innerHTML="ไม่มีการแย่ง";
  return;
 }

 let w=a[Math.floor(Math.random()*a.length)];

 document.getElementById("result").innerHTML=
 "ผู้ได้สิทธิ์: "+w;

}


load();
