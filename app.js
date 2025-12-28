// URL dan drug_id olish
const params = new URLSearchParams(window.location.search);
const drugId = params.get("drug_id") || "1"; // agar drug_id bo‘lmasa, default 1

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

// Sahifani to‘ldirish funksiyasi
function render(data) {
  drugName.innerText = "💊 " + data.drug_name;
  mnn.innerText = "MNN: " + data.mnn;
  analysisText.innerText = data.analysis;

  analogsDiv.innerHTML = "";
  data.analogs.forEach(a => {
    const btn = document.createElement("button");
    btn.className = "analog-btn";
    btn.innerText = a.name;
    btn.onclick = () => {
      // Telegram WebApp ichida sahifani yangilash
      if (window.Telegram?.WebApp) {
        const newUrl = `${window.location.pathname}?drug_id=${a.id}`;
        history.pushState({}, '', newUrl);
        loadAnalysis(a.id);
      } else {
        window.location.search = "?drug_id=" + a.id;
      }
    };
    analogsDiv.appendChild(btn);
  });
}

// Analizni yuklash funksiyasi
async function loadAnalysis(drugId) {
  try {
    // 1. Avval yuklanmoqda degan xabar
    drugName.innerText = "💊 Yuklanmoqda...";
    analysisText.innerText = "Ma'lumot yuklanmoqda...";
    analogsDiv.innerHTML = "";
    
    // 2. Backenddan so‘rov (hozircha mock)
    // Keyinchalik quyidagi satrni ishlatish kerak:
    // const res = await fetch(`/api/analyze?drug_id=${drugId}`);
    // const data = await res.json();
    
    // 3. Hozircha mock ma'lumot (backend tayyor bo‘lganda o‘zgartiriladi)
    const mockData = {
      drug_name: `Dori #${drugId}`,
      mnn: "mnn_" + drugId,
      analysis: `Bu ${drugId}-ID li dori haqida AI tahlil.\n\n📊 Tahlil qilindi!\n✅ Faol modda: mavjud\n⚖️ Doza: 500mg`,
      analogs: [
        { id: parseInt(drugId) + 1, name: `Analog ${parseInt(drugId) + 1}` },
        { id: parseInt(drugId) + 2, name: `Analog ${parseInt(drugId) + 2}` }
      ]
    };
    
    // 4. Kichik kechikish (loading effekti uchun)
    setTimeout(() => {
      render(mockData);
    }, 300);
    
  } catch (e) {
    console.error("Xatolik:", e);
    // Xatolik bo‘lsa, mock ma'lumotni ko‘rsatish
    drugName.innerText = "💊 Xatolik";
    analysisText.innerText = "Ma'lumot yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.";
  }
}

// Telegram WebApp sozlamalari
function initTelegramWebApp() {
  if (window.Telegram?.WebApp) {
    const tg = Telegram.WebApp;
    
    // Back tugmasi
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      tg.close();
    });
    
    // Telegram user ma'lumotlarini olish
    const user = tg.initDataUnsafe?.user;
    if (user) {
      console.log("Telegram user:", user);
      // User ID ni backendga yuborish mumkin
    }
  }
}

// Dastur ishga tushganda
document.addEventListener("DOMContentLoaded", function() {
  // 1. Telegram WebApp ni ishga tushirish
  initTelegramWebApp();
  
  // 2. Drug ID bo‘yicha ma'lumot yuklash
  if (drugId) {
    loadAnalysis(drugId);
  } else {
    render(mockResponse);
  }
  
  // 3. Test tugmasi
  document.getElementById("start-test").onclick = () => {
    alert("🧠 Test tez orada ishga tushadi!");
    
    // Test boshlash
    document.getElementById("test-content").innerHTML = `
      <div class="test-question">
        <p>1. Sizga dori kim tomonidan tavsiya qilingan?</p>
        <button onclick="answerQuestion(1, 'doctor')">👨‍⚕️ Shifokor</button>
        <button onclick="answerQuestion(1, 'self')">🙋 O‘zim</button>
      </div>
    `;
  };
});

// Test uchun qo‘shimcha funksiya
function answerQuestion(qNum, answer) {
  console.log(`Savol ${qNum}: ${answer}`);
  // Keyinchalik test logikasini to‘ldirish kerak
}