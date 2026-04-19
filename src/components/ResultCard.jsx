import React from "react";

function ResultCard({ result }) {

  const color =
    result.risk_level === "HIGH"
      ? "red"
      : result.risk_level === "MEDIUM"
      ? "orange"
      : "green";

  return (
    <div style={{ border: "2px solid", borderColor: color, padding: "10px" }}>
      <h2>Risk: {result.risk_level}</h2>
      <h3>Probability: {result.failure_probability.toFixed(2)}</h3>
      <p>{result.recommended_action}</p>
    </div>
  );
}

export default ResultCard;