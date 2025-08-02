import React, { useState } from "react";

const ImageUpload = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageUpload(file); // App.js'e dosyayı gönder
    }
  };

  return (
    <div style={styles.container}>
      <label htmlFor="imageInput" style={styles.label}>
        📷 Fotoğraf Seç
      </label>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        style={styles.input}
        onChange={handleChange}
      />
      {preview && <img src={preview} alt="preview" style={styles.preview} />}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
  },
  label: {
    backgroundColor: "#007BFF",
    padding: "10px 20px",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
  },
  input: {
    display: "none",
  },
  preview: {
    marginTop: "20px",
    maxWidth: "300px",
    maxHeight: "300px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
};

export default ImageUpload;