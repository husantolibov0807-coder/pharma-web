const res = await fetch(API_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: drugText,
    language: "uz"
  })
});
const data = await res.json();
render(data);


// ================= URL PARAM =================
const params = new URLSearchParams(window.location.search);
const drugId = params.get("drug_id") || "Ibuprofen";

// ================= DOM =================
const drugName = document.getElementById("drug-name");
const mnn = document.getElementById("mnn");
const analysisText = document.getElementById("analysis-text");
const analogsDiv = document.getElementById("analogs");

// ================= RENDER =================
function render(data) {
  drugName.innerText = "💊 " + data.drug_name;
  mnn.innerText = "MNN: " + (data.mnn || "-");
  analysisText.innerText = data.analysis || data.purpose || "Ma'lumot yo‘q";

  analogsDiv.innerHTML = "";
  if (data.analogs) {
    data.analogs.forEach(a => {
      const btn = document.createElement("button");
      btn.className = "analog-btn";
      btn.innerText = a.name;
      btn.onclick = () => {
        const newUrl = `?drug_id=${a.name}`;
        history.pushState({}, "", newUrl);
        loadAnalysis(a.name);
      };
      analogsDiv.appendChild(btn);
    });
  }
}

// ================= LOAD ANALYSIS =================
async function loadAnalysis(drugText) {
  drugName.innerText = "💊 Yuklanmoqda...";
  analysisText.innerText = "AI tahlil qilmoqda...";
  analogsDiv.innerHTML = "";

  try {
    // 🔥 REAL BACKEND (keyin yoqiladi)
    /*
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: drugText,
        language: "uz"
      })
    });
    const data = await res.json();
    render(data);
    */

    // ✅ HOZIRCHA MOCK
    setTimeout(() => {
      render({
        drug_name: drugText,
        mnn: drugText.toLowerCase(),
        analysis: `🧠 AI tahlil (mock)
📌 Dori: ${drugText}
⚕️ Guruhi: Antibiotik
⚠️ Eslatma: Shifokor bilan maslahatlashing`,
        analogs: [
          { name: "Amoxiclav" },
          { name: "Ceftriaxone" }
        ]
      });
    }, 400);

  } catch (e) {
    analysisText.innerText = "❌ Xatolik yuz berdi";
    console.error(e);
  }
}

// ================= TELEGRAM INIT =================
function initTelegramWebApp() {
  if (window.Telegram?.WebApp) {
    const tg = Telegram.WebApp;
    tg.expand();
    tg.ready();
    tg.setBackgroundColor("#ffffff");
    tg.setHeaderColor("#2ea6ff");

    tg.BackButton.show();
    tg.BackButton.onClick(() => tg.close());
  }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  initTelegramWebApp();
  loadAnalysis(drugId);

  document.getElementById("start-test").onclick = () => {
    document.getElementById("test-content").innerHTML = `
      <p>1. Dori kim tavsiya qilgan?</p>
      <button>👨‍⚕️ Shifokor</button>
      <button>🙋 O‘zim</button>
    `;
  };
});
