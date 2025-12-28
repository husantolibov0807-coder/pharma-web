// URL dan drug_id olish
const params = new URLSearchParams(window.location.search);
const drugId = params.get("drug_id");

// DOM elementlar
const drugName = document.getElementById("drug-name");
const mnn = document.getElementById("mnn");
const analysisText = document.getElementById("analysis-text");
const analogsDiv = document.getElementById("analogs");

// ⚠️ hozircha MOCK data (backend keyin ulanadi)
const mockResponse = {
  drug_name: "Ampicillin + Sulbactam",
  mnn: "ampicillin + sulbactam",
  analysis: `
Bu kombinatsiyalangan antibiotik bo‘lib,
beta-laktamaza ishlab chiqaruvchi bakteriyalarga qarshi samarali.

📌 Guruhi: Antibiotik
⚙️ Ta’siri: bakteritsid
⛔ Qarshi ko‘rsatmalar: allergiya
⚠️ Nojo‘ya ta’sirlar: diareya, toshma
`,
  analogs: [
    { id: 2, name: "Ceftriaxone + Sulbactam" },
    { id: 3, name: "Amoxiclav" },
    { id: 4, name: "Tazobactam Combo" }
  ]
};

// Sahifani to‘ldirish
function render(data) {
  drugName.innerText = "💊 " + data.drug_name;
  mnn.innerText = "MNN: " + data.mnn;
  analysisText.innerText = data.analysis;

  analogsDiv.innerHTML = "";
  data.analogs.forEach(a => {
    const btn = document.createElement("button");
    btn.innerText = a.name;
    btn.onclick = () => {
      window.location.search = "?drug_id=" + a.id;
    };
    analogsDiv.appendChild(btn);
  });
}

render(mockResponse);
if (drugId) {
  loadAnalysis(drugId);
} else {
  render(mockResponse);
}


// Test tugmasi
document.getElementById("start-test").onclick = () => {
  alert("🧠 Test tez orada ishga tushadi!");
};

async function loadAnalysis(drugId) {
  try {
    const res = await fetch(`/api/analyze?drug_id=${drugId}`);
    const data = await res.json();
    render(data);
  } catch (e) {
    console.error(e);
    render(mockResponse); // fallback
  }
}
