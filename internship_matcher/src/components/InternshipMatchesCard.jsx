import React from "react";
import {Link} from "react-router-dom";

const InternshipMatchesCard = ({internship, onSelect}) => {
    return (
        <div className="card"
             onClick={() => onSelect(internship)}
             style={{
                 border: "1px solid #ccc",
                 padding: "16px",
                 marginBottom: "16px",
                 borderRadius: "8px",
                 cursor: "pointer"
             }}>
            <div className="card-info">
                <h3>{internship.title}</h3>
                <p><strong>{internship.company}</strong> - {internship.location}</p>

                {/* Progress Bar Container */}
                <div className="w3-light-grey" style={{backgroundColor: "#f1f1f1", borderRadius: "4px"}}>
                    {/* Dynamic Width based on matchPercentage */}
                    <div
                        className="w3-container w3-green w3-center"
                        style={{
                            width: `${internship.matchPercentage}%`,
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "2px 0",
                            borderRadius: "4px"
                        }}
                    >
                        {internship.matchPercentage}%
                    </div>
                </div>

                <div className="card-details" style={{marginTop: "16px"}}>
                    <h5>Top match factoren</h5>
                    <ul>
                        {/* Loop through the dynamic match factors */}
                        {internship.matchFactors.map((factor, index) => (
                            <li key={index}>
                                {factor.name} ({factor.value})
                            </li>
                        ))}
                    </ul>
                </div>

                <Link to={internship.url} style={{color: "blue", textDecoration: "underline"}}>
                    Bekijk volledige Analyse
                </Link>
            </div>
        </div>
    );
};

export default InternshipMatchesCard;