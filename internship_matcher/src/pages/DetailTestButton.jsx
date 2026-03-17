// DetailTestButton.jsx
import React from 'react';

const DetailTestButton = ({internship, onSelect}) => {
    return (
        <button
            onClick={() => onSelect(internship)}
            style={{
                width: "100%", backgroundColor: "#4054FF", color: "white", padding: "12px",
                borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", marginTop: "auto"
            }}
        >
            Bekijk Volledige Analyse
        </button>
    );
};

export default DetailTestButton;