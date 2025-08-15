import React from "react";

const DrugExplanationCard = ({ drugName, explanation }) => {
  if (!explanation) return null;

  // Ham metni JSON parse etmeden, sadece başlıklarla bölüyoruz
  return (
    <div style={styles.card}>
      <h2 style={{ marginTop: 0 }}>{`İlacın adı: ${drugName || "Bilinmeyen İlaç"}`}</h2>

      <h3>Kullanım Alanları</h3>
      <pre style={styles.pre}>{extractSection(explanation, "usage")}</pre>

      <h3>Yan Etkiler</h3>
      <pre style={styles.pre}>{extractSection(explanation, "side_effects")}</pre>

      <h3>Uyarılar</h3>
      <pre style={styles.pre}>{extractSection(explanation, "warnings")}</pre>


    </div>
  );
};

// Basit fonksiyon: belirli başlığı metinden çıkar
function extractSection(text, key) {
  try {
    const regex = new RegExp(`"${key}"\\s*:\\s*(\\[.*?\\])`, "s");
    const match = text.match(regex);
    if (!match) return "Bilgi yok";
    // JSON array string'ini parse edip satır satır döndür
    const arr = JSON.parse(match[1]);
    return arr.join("\n");
  } catch {
    return "Bilgi yok";
  }
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "700px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
  },
  pre: {
    whiteSpace: "pre-wrap",
    textAlign: "left",
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default DrugExplanationCard;
