import React from "react";

const DrugExplanationCard = ({ drugName, explanation }) => {
  if (!explanation) return null;

  return (
    <div style={styles.card}>
      <h2>{drugName}</h2>
      <p><strong>Kullanım:</strong> {explanation.usage}</p>
      <p>
        <strong>Yan etkiler:</strong>{" "}
        {explanation.side_effects && explanation.side_effects.length > 0
          ? explanation.side_effects.join(", ")
          : "Yok"}
      </p>
      <p>
        <strong>Uyarılar:</strong>{" "}
        {explanation.warnings && explanation.warnings.length > 0
          ? explanation.warnings.join(", ")
          : "Yok"}
      </p>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
  },
};

export default DrugExplanationCard;
