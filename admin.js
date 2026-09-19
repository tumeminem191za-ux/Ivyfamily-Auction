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


// =========================
// LOGIN
// =========================

window.login = function () {

  const pass = document.getElementById("pass").value;

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

      const x = d.data();

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

  const item =
    document.getElementById("wheelItem").value;

  players = [
    ...new Set(
      data
        .filter(x => x.item === item)
        .map(x => x.name)
    )
  ];


  document.getElementById("players").innerHTML =
    players
      .map(name => `
        <div class="player">
          👤 ${name}
        </div>
      `)
      .join("");


  if (players.length === 0) {

    document.getElementById("result").innerHTML =
      "ยังไม่มีผู้ลงชื่อสำหรับไอเทมนี้";

  } else {

    document.getElementById("result").innerHTML =
      `มีผู้แย่งสิทธิ์ ${players.length} คน`;

  }


  // รีเซ็ตวงล้อ
  angle = 0;

  drawWheel();

};


// =========================
// DRAW WHEEL
// =========================

function drawWheel() {

  const canvas =
    document.getElementById("wheel");

  const ctx =
    canvas.getContext("2d");

  const r =
    canvas.width / 2;


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (players.length === 0) return;


  const colors = [
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


  const size =
    (Math.PI * 2) /
    players.length;


  players.forEach((name, i) => {

    const start =
      angle +
      (i * size);


    // =========================
    // ช่องวงล้อ
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
    // ชื่อ
    // =========================

    ctx.save();

    ctx.translate(r, r);

    ctx.rotate(
      start + (size / 2)
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
  // ตรงกลาง
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
  // เข็มด้านบน
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
// NORMALIZE ANGLE
// =========================

function normalizeAngle(value) {

  const full =
    Math.PI * 2;

  value =
    value % full;

  if (value < 0) {

    value += full;

  }

  return value;

}


// =========================
// FIND PLAYER UNDER POINTER
// =========================

function getWinnerFromPointer() {

  if (players.length === 0) {

    return null;

  }


  const size =
    (Math.PI * 2) /
    players.length;


  /*
   * เข็มอยู่ด้านบน
   * = -90 องศา
   */

  const pointerAngle =
    -Math.PI / 2;


  /*
   * หามุมของเข็ม
   * เมื่อเทียบกับวงล้อที่หมุนอยู่
   */

  const relativeAngle =
    normalizeAngle(
      pointerAngle - angle
    );


  /*
   * หา segment ที่เข็มอยู่
   */

  let winnerIndex =
    Math.floor(
      relativeAngle / size
    );


  /*
   * กันกรณี floating point
   */

  if (
    winnerIndex < 0 ||
    winnerIndex >= players.length
  ) {

    winnerIndex = 0;

  }


  return players[winnerIndex];

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


  /*
   * รอบนี้จะไม่สุ่มชื่อผู้ชนะก่อน
   *
   * สุ่มแค่ตำแหน่งที่วงล้อจะหยุด
   *
   * จากนั้นค่อยดูว่าเข็มชี้ใคร
   */


  const fullTurn =
    Math.PI * 2;


  const randomStop =
    Math.random() * fullTurn;


  /*
   * หมุนอย่างน้อย 8 รอบ
   */

  const totalRotation =
    (fullTurn * 8) +
    randomStop;


  const startAngle =
    angle;


  const finalAngle =
    startAngle +
    totalRotation;


  let startTime = null;


  // 7 วินาที
  const duration = 7000;


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


    /*
     * Ease Out
     * ช่วงท้ายหมุนช้าลง
     */

    const ease =
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

      /*
       * บังคับตำแหน่งสุดท้าย
       */

      angle =
        finalAngle;


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

  /*
   * สำคัญมาก
   *
   * ไม่สุ่มชื่อใหม่
   *
   * อ่านจากตำแหน่งเข็มจริง
   */

  const winner =
    getWinnerFromPointer();


  const item =
    document.getElementById(
      "wheelItem"
    ).value;


  if (!winner) {

    spinning = false;

    return;

  }


  /*
   * หาข้อมูลของผู้ชนะ
   */

  const winData =
    data.find(
      x =>
        x.item === item &&
        x.name === winner
    );


  // =========================
  // POPUP
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
      collection(
        db,
        "history"
      ),
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
// LOAD HISTORY
// =========================

window.loadHistory = async function () {

  const box =
    document.getElementById(
      "history"
    );


  if (!box) return;


  try {

    const snap =
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

  const box =
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

  const input =
    document.getElementById(
      "searchHistory"
    );


  const key =
    input.value
      .trim()
      .toLowerCase();


  if (key === "") {

    renderHistory(
      historyData
    );

    return;

  }


  const result =
    historyData.filter(x => {

      const item =
        String(
          x.item || ""
        ).toLowerCase();


      const winner =
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

    const snap =
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

    const snap =
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
