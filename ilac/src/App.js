// front-end/App.js
import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import TextInputForm from "./components/TextInputForm";
import DrugExplanationCard from "./components/DrugExplanationCard";

function App() {
  const [inputType, setInputType] = useState(null);
  const [drugName, setDrugName] = useState("");
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError("");
    setExplanation(null);
    setDrugName("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/get-drug-info", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Görselden bilgi alınamadı");

      setDrugName(data.drug_name);
      setExplanation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (drug) => {
    setLoading(true);
    setError("");
    setExplanation(null);
    setDrugName(drug);

    try {
      const res = await fetch("/get-drug-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drug_name: drug }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Bilgi alınamadı");

      setExplanation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>💊 İlaç Tanıma ve Açıklama Sistemi</h1>
      {!inputType && (
        <div>
          <button onClick={() => setInputType("image")} style={btnStyle}>📷 Görsel Yükle</button>
          <button onClick={() => setInputType("text")} style={btnStyle}>✍ İlaç Yaz</button>
        </div>
      )}
      {inputType === "image" && <ImageUpload onImageUpload={handleImageUpload} loading={loading} />}
      {inputType === "text" && <TextInputForm onSubmitDrug={handleTextSubmit} loading={loading} />}

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <DrugExplanationCard drugName={drugName} explanation={explanation} />
    </div>
  );
}

const btnStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#28a745",
  color: "white",
  cursor: "pointer",
};

export default App;