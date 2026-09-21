import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


let data = [];
let historyData = [];
let players = [];

let angle = 0;
let spinning = false;


// =========================
// รายการไอเทม
// =========================

const ITEMS = [
  "หลวนเฟิงลั่วหยาง",
  "ญาณแท้เชี่ยวชาญชูโจว",
  "ญาณแท้ชูโจว",
  "เสียงสวรรค์ลั่วหยาง",
  "หยกวิญญานฟ้า",
  "ลายปักเมฆสูงส่ง"
];


// =========================
// LOGIN
// =========================

window.login = function () {

  const pass =
    document.getElementById("pass").value;

  if (pass === "1234") {

    document.getElementById("admin").style.display = "block";

    loadHistory();

    renderBids();

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

    renderBids();

  },

  error => {

    console.error(error);

    const box =
      document.getElementById("bidList");

    if (box) {

      box.innerHTML =
        `<div class="empty">
          โหลดรายชื่อไม่สำเร็จ
        </div>`;

    }

  }

);


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// =========================
// สร้าง SELECT ไอเทม
// =========================

function itemOptions(selected) {

  return ITEMS.map(item => {

    return `
      <option
        value="${escapeHTML(item)}"
        ${item === selected ? "selected" : ""}>
        ${escapeHTML(item)}
      </option>
    `;

  }).join("");

}


// =========================
// สร้าง SELECT หน้า 1-15
// =========================

function pageOptions(selected) {

  let html = "";

  for (let i = 1; i <= 15; i++) {

    const page =
      "หน้า " + i;

    html += `
      <option
        value="${page}"
        ${page === selected ? "selected" : ""}>
        ${page}
      </option>
    `;

  }

  return html;

}


// =========================
// RENDER BIDS
// =========================

window.renderBids = function () {

  const box =
    document.getElementById("bidList");

  if (!box) return;


  const input =
    document.getElementById("searchBids");


  const key =
    input
      ? input.value.trim().toLowerCase()
      : "";


  let list = data;


  if (key !== "") {

    list = data.filter(x => {

      const name =
        String(x.name || "").toLowerCase();

      const item =
        String(x.item || "").toLowerCase();

      const page =
        String(x.page || "").toLowerCase();

      const piece =
        String(x.piece || "").toLowerCase();


      return (
        name.includes(key) ||
        item.includes(key) ||
        page.includes(key) ||
        piece.includes(key)
      );

    });

  }


  if (list.length === 0) {

    box.innerHTML =
      `<div class="empty">
        ${
          key
            ? "ไม่พบรายการที่ค้นหา"
            : "ยังไม่มีรายชื่อผู้ประมูล"
        }
      </div>`;

    return;

  }


  box.innerHTML = list.map(x => `

    <div class="bid-row">

      <div class="bid-info">

        👤 <strong>
          ${escapeHTML(x.name)}
        </strong>

        <br>

        📦 ${escapeHTML(x.item)}

        <br>

        📄 ${escapeHTML(x.page)}

        | 🔢 ชิ้น ${escapeHTML(x.piece)}

        <br>

        ⏰ ${escapeHTML(x.registerTime || "-")}

      </div>


      <div style="margin-top:10px;">

        <button
          class="edit-btn"
          onclick="startEdit('${x.id}')">

          ✏️ แก้รายการ

        </button>


        <button
          class="delete-btn"
          onclick="deleteBid('${x.id}')">

          🗑️ ลบรายการ

        </button>

      </div>


      <div
        id="edit-${x.id}"
        class="edit-box"
        style="display:none;">

        <h3>
          ✏️ แก้รายการ
        </h3>


        <label>
          👤 ชื่อ
        </label>

        <input
          id="edit-name-${x.id}"
          value="${escapeHTML(x.name)}"
        >


        <label>
          📦 ไอเทม
        </label>

        <select
          id="edit-item-${x.id}">

          ${itemOptions(x.item)}

        </select>


        <label>
          📄 หน้า
        </label>

        <select
          id="edit-page-${x.id}">

          ${pageOptions(x.page)}

        </select>


        <label>
          🔢 เลขชิ้น
        </label>

        <input
          id="edit-piece-${x.id}"
          value="${escapeHTML(x.piece)}"
          inputmode="numeric"
        >


        <div style="margin-top:10px;">

          <button
            class="save-btn"
            onclick="saveEdit('${x.id}')">

            💾 บันทึก

          </button>


          <button
            class="cancel-btn"
            onclick="cancelEdit('${x.id}')">

            ❌ ยกเลิก

          </button>

        </div>

      </div>

    </div>

  `).join("");

};


// =========================
// SEARCH
// =========================

window.searchBids = function () {

  renderBids();

};


// =========================
// เปิดฟอร์มแก้ไข
// =========================

window.startEdit = function (id) {

  const box =
    document.getElementById(
      "edit-" + id
    );

  if (!box) {

    alert("ไม่พบช่องแก้ไข");

    return;

  }


  box.style.display = "block";

  box.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

};


// =========================
// ยกเลิกแก้ไข
// =========================

window.cancelEdit = function (id) {

  const box =
    document.getElementById(
      "edit-" + id
    );

  if (!box) return;

  box.style.display = "none";

};


// =========================
// บันทึกการแก้ไข
// =========================

window.saveEdit = async function (id) {

  const oldData =
    data.find(x => x.id === id);


  if (!oldData) {

    alert("ไม่พบรายการนี้");

    return;

  }


  const nameInput =
    document.getElementById(
      "edit-name-" + id
    );

  const itemInput =
    document.getElementById(
      "edit-item-" + id
    );

  const pageInput =
    document.getElementById(
      "edit-page-" + id
    );

  const pieceInput =
    document.getElementById(
      "edit-piece-" + id
    );


  if (
    !nameInput ||
    !itemInput ||
    !pageInput ||
    !pieceInput
  ) {

    alert("ไม่พบช่องข้อมูลสำหรับแก้ไข");

    return;

  }


  const name =
    nameInput.value.trim();

  const item =
    itemInput.value;

  const page =
    pageInput.value;

  const piece =
    pieceInput.value.trim();


  if (name === "") {

    alert("กรุณาใส่ชื่อ");

    return;

  }


  if (piece === "") {

    alert("กรุณาใส่เลขชิ้น");

    return;

  }


  // =========================
  // ป้องกันรายการซ้ำ
  // =========================

  const duplicate =
    data.find(x =>

      x.id !== id &&

      x.name === name &&

      x.item === item &&

      x.page === page &&

      x.piece === piece

    );


  if (duplicate) {

    alert(
      "มีรายการนี้อยู่แล้ว\n" +
      "ไม่สามารถบันทึกเป็นรายการซ้ำได้"
    );

    return;

  }


  const ok =
    confirm(
      "ยืนยันการแก้ไขรายการนี้?\n\n" +
      "👤 " + name + "\n" +
      "📦 " + item + "\n" +
      "📄 " + page + "\n" +
      "🔢 ชิ้น " + piece
    );


  if (!ok) return;


  try {

    await updateDoc(

      doc(
        db,
        "bids",
        id
      ),

      {
        name: name,
        item: item,
        page: page,
        piece: piece
      }

    );


    alert(
      "✅ แก้รายการเรียบร้อยแล้ว"
    );


  } catch (error) {

    console.error(error);

    alert(
      "❌ แก้รายการไม่สำเร็จ\n" +
      error.message
    );

  }

};


// =========================
// ลบรายการเดียว
// =========================

window.deleteBid = async function (id) {

  const bid =
    data.find(x => x.id === id);


  if (!bid) {

    alert("ไม่พบรายการนี้");

    return;

  }


  const ok =
    confirm(
      "ต้องการลบรายการนี้หรือไม่?\n\n" +
      "👤 " + bid.name + "\n" +
      "📦 " + bid.item + "\n" +
      "📄 " + bid.page + "\n" +
      "🔢 ชิ้น " + bid.piece
    );


  if (!ok) return;


  try {

    await deleteDoc(
      doc(
        db,
        "bids",
        id
      )
    );


    alert(
      "🗑️ ลบรายการเรียบร้อยแล้ว"
    );


  } catch (error) {

    console.error(error);

    alert(
      "❌ ลบรายการไม่สำเร็จ\n" +
      error.message
    );

  }

};


// =========================
// LOAD WHEEL
// =========================

window.loadWheel = function () {

  const item =
    document.getElementById(
      "wheelItem"
    ).value;


  players = [
    ...new Set(
      data
        .filter(x => x.item === item)
        .map(x => x.name)
    )
  ];


  document.getElementById(
    "players"
  ).innerHTML =

    players
      .map(name => `

        <div class="player">

          👤 ${escapeHTML(name)}

        </div>

      `)
      .join("");


  if (players.length === 0) {

    document.getElementById(
      "result"
    ).innerHTML =
      "ยังไม่มีผู้ลงชื่อสำหรับไอเทมนี้";

  } else {

    document.getElementById(
      "result"
    ).innerHTML =
      `มีผู้แย่งสิทธิ์ ${players.length} คน`;

  }


  angle = 0;

  drawWheel();

};


// =========================
// DRAW WHEEL
// =========================

function drawWheel() {

  const canvas =
    document.getElementById("wheel");


  if (!canvas) return;


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


    ctx.beginPath();

    ctx.moveTo(
      r,
      r
    );


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


    ctx.strokeStyle =
      "#fff";


    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.save();


    ctx.translate(
      r,
      r
    );


    ctx.rotate(
      start + (size / 2)
    );


    ctx.fillStyle =
      "#fff";


    ctx.font =
      "bold 16px sans-serif";


    ctx.textAlign =
      "left";


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

  ctx.fillStyle =
    "#111";

  ctx.fill();


  ctx.fillStyle =
    "#ffd700";

  ctx.font =
    "bold 22px sans-serif";

  ctx.textAlign =
    "center";


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


  ctx.fillStyle =
    "#ffd700";

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
// FIND WINNER
// =========================

function getWinnerFromPointer() {

  if (players.length === 0) {

    return null;

  }


  const size =
    (Math.PI * 2) /
    players.length;


  const pointerAngle =
    -Math.PI / 2;


  const relativeAngle =
    normalizeAngle(
      pointerAngle - angle
    );


  let winnerIndex =
    Math.floor(
      relativeAngle / size
    );


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


  const fullTurn =
    Math.PI * 2;


  const randomStop =
    Math.random() * fullTurn;


  const totalRotation =
    (fullTurn * 8) +
    randomStop;


  const startAngle =
    angle;


  const finalAngle =
    startAngle +
    totalRotation;


  let startTime = null;


  const duration =
    7000;


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


  const winData =
    data.find(
      x =>
        x.item === item &&
        x.name === winner
    );


  document.getElementById(
    "winnerBox"
  ).style.display =
    "block";


  document.getElementById(
    "winnerName"
  ).innerHTML =
    "🏆 " +
    escapeHTML(winner);


  document.getElementById(
    "winnerItem"
  ).innerHTML = `

    📦 ${escapeHTML(item)}

    <br>

    📄 หน้า ${
      escapeHTML(
        winData?.page || "-"
      )
    }

    <br>

    🔢 ชิ้น ${
      escapeHTML(
        winData?.piece || "-"
      )
    }

  `;


  document.getElementById(
    "result"
  ).innerHTML =
    "🎉 ผู้ได้สิทธิ์: " +
    escapeHTML(winner);


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
          new Date()
            .toLocaleString(
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
  ).style.display =
    "none";

};


// =========================
// LOAD HISTORY
// =========================

window.loadHistory =
async function () {

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

    box.innerHTML = `

      <div class="player">

        ยังไม่มีประวัติ

      </div>

    `;

    return;

  }


  box.innerHTML =

    list
      .map(x => `

        <div class="player">

          📦 ${
            escapeHTML(
              x.item || "-"
            )
          }

          <br>

          🏆 ${
            escapeHTML(
              x.winner || "-"
            )
          }

          <br>

          📄 หน้า ${
            escapeHTML(
              x.page || "-"
            )
          }

          <br>

          🔢 ชิ้น ${
            escapeHTML(
              x.piece || "-"
            )
          }

          <br>

          ⏰ ${
            escapeHTML(
              x.time || "-"
            )
          }

        </div>

      `)
      .join("");

}


// =========================
// SEARCH HISTORY
// =========================

window.searchHistory =
function () {

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
// CLEAR ALL BIDS
// =========================

window.clearAll =
async function () {

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
      "ล้างรายชื่อไม่สำเร็จ\n" +
      error.message
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
      "ล้างประวัติไม่สำเร็จ\n" +
      error.message
    );

  }

};
