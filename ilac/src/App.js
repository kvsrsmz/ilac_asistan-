import React, { useState } from "react";
import DrugExplanationCard from "./components/DrugExplanationCard";

function App() {
  const [inputType, setInputType] = useState(null); // 'text' veya 'image'
  const [drugName, setDrugName] = useState("");
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = async () => {
    if (!drugName.trim()) return alert("Lütfen ilaç adını girin.");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/get-drug-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_name: drugName })
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setExplanation(data.drug_info); // JSON zaten backend’de düzenlendi
      }
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/get-drug-info", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setDrugName(data.drug_name);
        setExplanation(data.drug_info);
      }
    } catch (err) {
      console.error(err);
      alert("Sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>💊 İlaç Asistanı</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setInputType("text")}>İlaç Adı Gir</button>
        <button onClick={() => setInputType("image")}>Görsel Yükle</button>
      </div>

      {inputType === "text" && (
        <div>
          <input
            type="text"
            value={drugName}
            onChange={(e) => setDrugName(e.target.value)}
            placeholder="İlaç adını yazın"
          />
          <button onClick={handleTextSubmit} disabled={loading}>
            {loading ? "Yükleniyor..." : "Sorgula"}
          </button>
        </div>
      )}

      {inputType === "image" && (
        <div>
          <input type="file" accept="image/*" onChange={handleImageSubmit} />
        </div>
      )}

      {explanation && <DrugExplanationCard drugName={drugName} explanation={explanation} />}
    </div>
  );
}

export default App;
