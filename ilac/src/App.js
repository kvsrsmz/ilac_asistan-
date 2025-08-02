import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import TextInputForm from "./components/TextInputForm";
import DrugExplanationCard from "./components/DrugExplanationCard";

function App() {
  const [inputType, setInputType] = useState(null); // "image" veya "text"
  const [drugName, setDrugName] = useState("");
  const [explanation, setExplanation] = useState("");

  // Görsel yüklendiğinde (VLM işlemi yapılacak yer)
  const handleImageUpload = (file) => {
    console.log("Yüklenen görsel:", file);
    // 🔁 Buraya VLM + LLM API çağrısı gelecek
    setDrugName("Parol 500mg"); // örnek çıktı
   setExplanation(`${drug} genellikle ağrı kesici ve ateş düşürücü olarak kullanılır.`);

  };

  // İlaç adı yazıldığında (LLM işlemi yapılacak yer)
  const handleTextSubmit = (drug) => {
    console.log("Yazılan ilaç adı:", drug);
    setDrugName(drug);
    // 🔁 Buraya LLM API çağrısı gelecek
    setExplanation(`${drug} genellikle ağrı kesici ve ateş düşürücü olarak kullanılır.`);

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

      {inputType === "image" && <ImageUpload onImageUpload={handleImageUpload} />}
      {inputType === "text" && <TextInputForm onSubmitDrug={handleTextSubmit} />}
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
  cursor: "pointer"
};

export default App;