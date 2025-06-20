import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import "./App.css";

const OfferLetter = ({ candidate }) => {
  const offerRef = useRef();

  const downloadPDF = () => {
    const element = offerRef.current;
    html2pdf().from(element).save(`${candidate.name}_Offer_Letter.pdf`);
  };

  return (
    <div className="offer-container">
      <div ref={offerRef} className="offer-letter">
        <h2>Employment Offer Letter</h2>
        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        <p><strong>Candidate Name:</strong> {candidate.name}</p>
        <p><strong>Position:</strong> {candidate.position}</p>
        <p><strong>Company:</strong> {candidate.company}</p>

        <p>Dear <strong>{candidate.name}</strong>,</p>

        <p>
          We are pleased to formally offer you the position of <strong>{candidate.position}</strong> at <strong>{candidate.company}</strong>.
          We were very impressed with your skills and experience, and we are excited about the contributions
          you will make to our team.
        </p>

        <p>
          Your employment with <strong>{candidate.company}</strong> will commence on <strong>{candidate.startDate}</strong>. You will be reporting
          to the HR department and working closely with the management team. Your initial annual salary will be <strong>{candidate.salary}</strong>,
          payable in accordance with the company's standard payroll schedule.
        </p>

        <p>
          As part of our team, you will be entitled to company benefits, including health insurance, paid leave, and other
          perks, as detailed in our employee handbook. We look forward to your contributions and hope you will find
          your time with us both professionally rewarding and personally fulfilling.
        </p>

        <p>
          Please review this offer carefully. If you accept this offer, kindly sign and return a copy of this letter no later
          than <strong>[Acceptance Deadline]</strong>. If you have any questions, please do not hesitate to contact us.
        </p>

        <p>Sincerely,</p>

        <p><strong>{candidate.hrManager}</strong></p>
        <p>HR Manager</p>
        <p><strong>{candidate.company}</strong></p>
      </div>

      <div className="button-container">
        <button className="download-btn" onClick={downloadPDF}>
          Download Offer Letter
        </button>
      </div>
    </div>
  );
};

export default OfferLetter;
