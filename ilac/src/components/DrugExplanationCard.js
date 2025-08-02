import React from "react";

const DrugExplanationCard = ({ drugName, explanation }) => {
  if (!explanation) return null;

  return (
    <div style={styles.card}>
      <h2>{drugName}</h2>
      <p>{explanation}</p>
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
    backgroundColor: "#f9f9f9"
  }
};

export default DrugExplanationCard;