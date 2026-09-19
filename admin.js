import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let data = [];
let historyData = [];
let players = [];

let angle = 0;
let spinning = false;
let selectedWinner = null;


// =========================
// LOGIN
// =========================

window.login = function () {

  let pass = document.getElementById("pass").value;

  if (pass === "1234") {

    document.getElementById("admin").style.display = "block";

    loadHistory();

  } else {

    alert("รหัสผิด");

  }

};


// =========================
// REALTIME BIDS
// =========================

onSnapshot(
  query(
    collection(db, "bids"),
    orderBy("time", "asc")
  ),

  snap => {

    data = [];

    snap.forEach(d => {

      let x = d.data();

      if (x.name && x.item) {

        data.push({
          id: d.id,
          ...x
        });

      }

    });

  }
);


// =========================
// LOAD WHEEL
// =========================

window.loadWheel = function () {

  let item = document.getElementById("wheelItem").value;

  players = [
    ...new Set(
      data
        .filter(x => x.item === item)
        .map(x => x.name)
    )
  ];

  document.getElementById("players").innerHTML =
    players
      .map(x => `<div class="player">👤 ${x}</div>`)
      .join("");


  if (players.length === 0) {

    document.getElementById("result").innerHTML =
      "ยังไม่มีผู้ลงชื่อสำหรับไอเทมนี้";

  } else {

    document.getElementById("result").innerHTML =
      `มีผู้แย่งสิทธิ์ ${players.length} คน`;

  }


  angle = 0;

  drawWheel();

};


// =========================
// DRAW WHEEL
// =========================

function drawWheel() {

  let canvas = document.getElementById("wheel");

  let ctx = canvas.getContext("2d");

  let r = canvas.width / 2;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (players.length === 0) return;


  let colors = [
    "#ff595e",
    "#ffca3a",
    "#8ac926",
    "#1982c4",
    "#6a4c93",
    "#ff924c",
    "#00b4d8",
    "#f72585",
    "#43aa8b",
    "#577590"
  ];


  let size =
    (Math.PI * 2) /
    players.length;


  players.forEach((name, i) => {

    let start =
      angle +
      (i * size);


    // =========================
    // SEGMENT
    // =========================

    ctx.beginPath();

    ctx.moveTo(r, r);

    ctx.arc(
      r,
      r,
      r - 5,
      start,
      start + size
    );

    ctx.fillStyle =
      colors[i % colors.length];

    ctx.fill();


    ctx.strokeStyle = "#fff";

    ctx.lineWidth = 3;

    ctx.stroke();


    // =========================
    // NAME
    // =========================

    ctx.save();

    ctx.translate(r, r);

    ctx.rotate(
      start +
      (size / 2)
    );

    ctx.fillStyle = "#fff";

    ctx.font =
      "bold 16px sans-serif";

    ctx.textAlign = "left";

    ctx.fillText(
      name,
      80,
      5
    );

    ctx.restore();

  });


  // =========================
  // CENTER
  // =========================

  ctx.beginPath();

  ctx.arc(
    r,
    r,
    50,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#111";

  ctx.fill();


  ctx.fillStyle = "#ffd700";

  ctx.font =
    "bold 22px sans-serif";

  ctx.textAlign = "center";

  ctx.fillText(
    "IVY",
    r,
    r + 8
  );


  // =========================
  // POINTER
  // =========================

  ctx.beginPath();

  ctx.moveTo(
    r - 25,
    0
  );

  ctx.lineTo(
    r + 25,
    0
  );

  ctx.lineTo(
    r,
    45
  );

  ctx.closePath();

  ctx.fillStyle = "#ffd700";

  ctx.fill();

}


// =========================
// SPIN
// =========================

window.spin = function () {

  if (spinning) return;


  if (players.length < 2) {

    alert(
      "กรุณาโหลดรายชื่อก่อน และต้องมีคนแย่งอย่างน้อย 2 คน"
    );

    return;

  }


  spinning = true;


  // =========================
  // RANDOM WINNER
  // =========================

  selectedWinner =
    players[
      Math.floor(
        Math.random() *
        players.length
      )
    ];


  let winnerIndex =
    players.indexOf(
      selectedWinner
    );


  let size =
    (Math.PI * 2) /
    players.length;


  // =========================
  // จุดที่ "กลางช่องผู้ชนะ"
  // ต้องตรงกับเข็มด้านบน
  // =========================

  let targetAngle =
    (-Math.PI / 2)
    -
    (winnerIndex * size)
    -
    (size / 2);


  let startAngle = angle;


  let currentTurn =
    angle %
    (Math.PI * 2);


  let difference =
    targetAngle -
    currentTurn;


  if (difference < 0) {

    difference +=
      Math.PI * 2;

  }


  // หมุน 8 รอบก่อนหยุด
  let totalRotation =
    (Math.PI * 2 * 8)
    +
    difference;


  let startTime = null;


  // 7 วินาที
  let duration = 7000;


  function animate(time) {

    if (!startTime) {

      startTime = time;

    }


    let progress =
      (time - startTime) /
      duration;


    if (progress > 1) {

      progress = 1;

    }


    // ease out
    let ease =
      1 -
      Math.pow(
        1 - progress,
        5
      );


    angle =
      startAngle +
      (totalRotation * ease);


    drawWheel();


    if (progress < 1) {

      requestAnimationFrame(
        animate
      );

    } else {

      // =========================
      // บังคับตำแหน่งสุดท้าย
      // =========================

      angle =
        startAngle +
        totalRotation;


      drawWheel();


      finishSpin();

    }

  }


  requestAnimationFrame(
    animate
  );

};


// =========================
// FINISH SPIN
// =========================

async function finishSpin() {

  let winner =
    selectedWinner;


  let item =
    document.getElementById(
      "wheelItem"
    ).value;


  // หาข้อมูลของผู้ชนะ
  let winData =
    data.find(
      x =>
        x.item === item &&
        x.name === winner
    );


  // =========================
  // WINNER POPUP
  // =========================

  document.getElementById(
    "winnerBox"
  ).style.display = "block";


  document.getElementById(
    "winnerName"
  ).innerHTML =
    "🏆 " + winner;


  document.getElementById(
    "winnerItem"
  ).innerHTML = `

    📦 ${item}

    <br>

    📄 หน้า ${winData?.page || "-"}

    <br>

    🔢 ชิ้น ${winData?.piece || "-"}

  `;


  document.getElementById(
    "result"
  ).innerHTML =
    "🎉 ผู้ได้สิทธิ์: " +
    winner;


  // =========================
  // SAVE HISTORY
  // =========================

  try {

    await addDoc(
      collection(db, "history"),
      {

        item: item,

        winner: winner,

        page:
          winData?.page || "",

        piece:
          winData?.piece || "",

        time:
          new Date().toLocaleString(
            "th-TH"
          )

      }
    );

  } catch (error) {

    console.error(error);

    alert(
      "บันทึกประวัติไม่สำเร็จ"
    );

  }


  await loadHistory();


  spinning = false;

  selectedWinner = null;

}


// =========================
// CLOSE WINNER
// =========================

window.closeWinner = function () {

  document.getElementById(
    "winnerBox"
  ).style.display = "none";

};


// =========================
// HISTORY
// =========================

window.loadHistory = async function () {

  let box =
    document.getElementById(
      "history"
    );


  if (!box) return;


  try {

    let snap =
      await getDocs(
        collection(
          db,
          "history"
        )
      );


    historyData = [];


    snap.forEach(d => {

      historyData.push({

        id: d.id,

        ...d.data()

      });

    });


    historyData.sort(
      (a, b) =>
        String(b.time)
          .localeCompare(
            String(a.time)
          )
    );


    renderHistory(
      historyData
    );


  } catch (error) {

    console.error(error);

    box.innerHTML =
      "โหลดประวัติไม่สำเร็จ";

  }

};


// =========================
// RENDER HISTORY
// =========================

function renderHistory(list) {

  let box =
    document.getElementById(
      "history"
    );


  if (!box) return;


  if (list.length === 0) {

    box.innerHTML =
      `<div class="player">
        ยังไม่มีประวัติ
      </div>`;

    return;

  }


  box.innerHTML =
    list
      .map(x => `

        <div class="player">

          📦 ${x.item || "-"}

          <br>

          🏆 ${x.winner || "-"}

          <br>

          📄 หน้า ${x.page || "-"}

          <br>

          🔢 ชิ้น ${x.piece || "-"}

          <br>

          ⏰ ${x.time || "-"}

        </div>

      `)
      .join("");

}


// =========================
// SEARCH HISTORY
// =========================

window.searchHistory = function () {

  let input =
    document.getElementById(
      "searchHistory"
    );


  let key =
    input.value
      .trim()
      .toLowerCase();


  if (key === "") {

    renderHistory(
      historyData
    );

    return;

  }


  let result =
    historyData.filter(x => {

      let item =
        String(
          x.item || ""
        ).toLowerCase();


      let winner =
        String(
          x.winner || ""
        ).toLowerCase();


      return (
        item.includes(key) ||
        winner.includes(key)
      );

    });


  renderHistory(
    result
  );

};


// =========================
// CLEAR BIDS
// =========================

window.clearAll = async function () {

  if (
    !confirm(
      "ล้างรายชื่อผู้ประมูลทั้งหมด?"
    )
  ) return;


  try {

    let snap =
      await getDocs(
        collection(
          db,
          "bids"
        )
      );


    let count = 0;


    for (
      const x of snap.docs
    ) {

      await deleteDoc(
        doc(
          db,
          "bids",
          x.id
        )
      );

      count++;

    }


    alert(
      "ล้างรายชื่อแล้วทั้งหมด " +
      count +
      " รายการ"
    );


  } catch (error) {

    console.error(error);

    alert(
      "ล้างรายชื่อไม่สำเร็จ"
    );

  }

};


// =========================
// CLEAR HISTORY
// =========================

window.clearHistory =
async function () {

  if (
    !confirm(
      "ล้างประวัติผู้ชนะทั้งหมด?"
    )
  ) return;


  try {

    let snap =
      await getDocs(
        collection(
          db,
          "history"
        )
      );


    let count = 0;


    for (
      const x of snap.docs
    ) {

      await deleteDoc(
        doc(
          db,
          "history",
          x.id
        )
      );

      count++;

    }


    historyData = [];


    renderHistory([]);


    alert(
      "ล้างประวัติแล้วทั้งหมด " +
      count +
      " รายการ"
    );


  } catch (error) {

    console.error(error);

    alert(
      "ล้างประวัติไม่สำเร็จ"
    );

  }

};
