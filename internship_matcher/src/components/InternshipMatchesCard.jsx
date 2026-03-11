import React from "react";
import DetailTestButton from "../pages/DetailTestButton"; // Ensure this path is correct!

const InternshipCard = ({internship, onSelect}) => {
    return (
        <div
            className="card"
            style={{
                border: "1px solid #ccc",
                padding: "16px",
                marginBottom: "16px",
                borderRadius: "8px",
                backgroundColor: "#fff"
            }}
        >
            <div className="card-info">
                <h3>{internship.title}</h3>
                <p><strong>{internship.company}</strong> - {internship.location}</p>

                {/* Progress Bar */}
                <div style={{backgroundColor: "#f1f1f1", borderRadius: "4px", overflow: "hidden"}}>
                    <div
                        style={{
                            width: `${internship.matchPercentage}%`,
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "2px 0",
                            textAlign: "center",
                            fontSize: "12px"
                        }}
                    >
                        {internship.matchPercentage}%
                    </div>
                </div>

                <div className="card-details" style={{marginTop: "16px"}}>
                    <h5>Top match factoren</h5>
                    <ul>
                        {internship.matchFactors.map((factor, index) => (
                            <li key={index}>
                                {factor.name} ({factor.value})
                            </li>
                        ))}
                    </ul>
                </div>

                {/* REPLACE THE <a> TAG WITH THIS */}
                <div style={{marginTop: "20px"}}>
                    <DetailTestButton
                        internship={internship}
                        onSelect={onSelect}
                    />
                </div>
            </div>
        </div>
    );
};

export default InternshipCard;
