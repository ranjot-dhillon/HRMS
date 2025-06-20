import React from "react";
import "./App.css";
import OfferLetter from "./OfferLetter";

const App = () => {
  const candidateData = {
    name: "John Doe",
    position: "Software Engineer",
    company: "Tech Solutions Inc.",
    startDate: "March 1, 2025",
    salary: "$80,000",
    hrManager: "Jane Smith",
  };

  return (
    <div className="app-container">
      <h1>HRMS - Offer Letter Generator</h1>
      <OfferLetter candidate={candidateData} />
    </div>
  );
};

export default App;
