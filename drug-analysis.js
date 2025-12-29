export default async function handler(req, res) {
  // Faqat POST ruxsat
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, language = "uz" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Drug text is required" });
    }

    // 🔥 HOZIRCHA MOCK AI
    // Keyin OpenAI qo‘shamiz
    const response = {
      drug_name: text,
      mnn: text.toLowerCase(),
      analysis: `
🧠 AI Tahlil

📌 Dori: ${text}
⚕️ Guruhi: Antibiotik
⚠️ Ogohlantirish: Shifokor bilan maslahatlashing
🌍 Til: ${language}
`,
      analogs: [
        { name: "Amoxiclav" },
        { name: "Ceftriaxone" },
        { name: "Azithromycin" }
      ]
    };

    return res.status(200).json(response);

  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
