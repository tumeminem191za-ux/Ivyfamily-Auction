// แทนที่ฟังก์ชัน finishSpin เดิมทั้งหมด

async function finishSpin(){


let size =
( Math.PI * 2 ) / players.length;



let finalAngle =
angle % (Math.PI * 2);



// คำนวณช่องที่เข็มชี้

let index =
Math.floor(
(
( Math.PI * 2 - finalAngle )
+
size / 2
)
/
size
);



index =
index % players.length;



let winner =
players[index];



// กัน undefined

if(!winner){

winner =
players[0];

}




let item =
document.getElementById("wheelItem").value;



let winData =
data.find(x=>

x.item==item &&
x.name==winner

);





document.getElementById("winnerBox").style.display="block";



document.getElementById("winnerName").innerHTML=

"🏆 "+winner;



document.getElementById("winnerItem").innerHTML=

`
📦 ${item}
<br>
📄 หน้า ${winData?.page || "-"}
ชิ้น ${winData?.piece || "-"}
`;





document.getElementById("result").innerHTML=

"ผู้ชนะ: "+winner;





await addDoc(

collection(db,"history"),

{

item:item,

winner:winner,

page:winData?.page || "",

piece:winData?.piece || "",

time:new Date().toLocaleString("th-TH")

}

);



loadHistory();


spinning=false;


}
