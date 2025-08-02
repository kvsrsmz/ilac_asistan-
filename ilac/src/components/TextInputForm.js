import React, { useState } from "react";

const TextInputForm = ({ onSubmitDrug }) => {
  const [drugName, setDrugName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (drugName.trim()) {
      onSubmitDrug(drugName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="İlaç adını ve dozunu yazın (örneğin: Parol 500mg)"
        value={drugName}
        onChange={(e) => setDrugName(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Açıklama Al</button>
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30px"
  },
  input: {
    width: "300px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default TextInputForm;