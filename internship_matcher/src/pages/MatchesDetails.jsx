import React, {useState} from "react";
import InternshipMatchesCard from "../components/InternshipMatchesCard.jsx";

// --- MOCK DATA (Re-added) ---
const mockInternships = [
    {
        id: 1,
        title: "Junior Frontend Developer",
        company: "techStart Amsterdam",
        location: "Amsterdam",
        matchPercentage: 87,
        matchFactors: [
            {name: "React Skills", value: "+15%"},
            {name: "Beschikbaar per februari", value: "+12%"},
            {name: "Python ervaring", value: "+8%"}
        ],
        about: "We zoeken een tech-savvy student die ons team wil versterken in het bouwen van schaalbare webapplicaties.",
        Vereist: [
            {name: "React"},
            {name: "Javascript"},
            {name: "HTML/CSS"},
            {name: "Python"},
            {name: "Tailwind"}
        ],
        url: "/stage/1"
    },
    // Add other mock internships here if needed...
];


const MatchesDetails = () => {
    const [internships, setInternships] = useState(mockInternships);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [isFlagging, setIsFlagging] = useState(false);
    const [reportText, setReportText] = useState("");

    // The POST request functionality
    const handleSendFlag = async () => {
        const payload = {
            internshipId: selectedInternship.id,
            reason: reportText,
            timestamp: new Date().toISOString()
        };

        console.log("Sending POST request to API:", payload);

        // LATER: Replace with actual fetch call
        // const response = await fetch('/api/flags', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload)
        // });

        alert("Fout gemeld bij de stagecoördinator.");
        setIsFlagging(false);
        setReportText("");
    };

    return (
        <div>
            {/* List of Internship Cards (Re-added) */}
            <h2>Jouw Stage Matches</h2>
            <div className="card-list">
                {internships.map(stage => (
                    <InternshipMatchesCard
                        key={stage.id}
                        internship={stage}
                        onSelect={setSelectedInternship} // This sets the selected internship
                    />
                ))}
            </div>

            {/* Modal Logic */}
            {selectedInternship && (
                <div className="modal" style={modalStyle}>
                    <h2>{selectedInternship.title}</h2>

                    {/* The Flag Button/Icon */}
                    <button
                        onClick={() => setIsFlagging(!isFlagging)}
                        style={{background: "none", border: "none", cursor: "pointer", fontSize: "20px"}}
                        title="Meld foutieve AI conclusie"
                    >
                        🚩 Rapporteer fout
                    </button>

                    {/* Conditional Flagging Form */}
                    {isFlagging && (
                        <div style={{marginTop: "20px", padding: "15px", border: "1px solid red", borderRadius: "8px"}}>
                            <h4>Wat klopt er niet aan deze weging?</h4>
                            <textarea
                                value={reportText}
                                onChange={(e) => setReportText(e.target.value)}
                                placeholder="Leg uit waarom deze conclusie onjuist is..."
                                style={{width: "100%", height: "80px", marginBottom: "10px"}}
                            />
                            <button onClick={handleSendFlag} style={{
                                backgroundColor: "#EF4444",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                border: "none"
                            }}>
                                Verstuur Melding
                            </button>
                        </div>
                    )}

                    <button onClick={() => {
                        setSelectedInternship(null);
                        setIsFlagging(false);
                    }}>
                        Sluit venster
                    </button>
                </div>
            )}
        </div>
    );
};

const modalStyle = {
    position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, 0)",
    backgroundColor: "white", padding: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 1000,
    maxWidth: "500px", width: "90%"
};

export default MatchesDetails;