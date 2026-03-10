import React, {useState, useEffect} from 'react';
import IntershipMatchesCard from "../components/IntershipMatchesCard.jsx";

// --- 1. MOCK DATA ---
// This simulates what you will eventually fetch from your database.
const mockInternships = [
    {
        id: 1,
        title: "Junior Frontend Developer",
        company: "techStart Amsterdam",
        location: "Amsterdam",
        matchPercentage: 45,
        matchFactors: [
            {name: "React skills", value: "+15%"},
            {name: "Beschikbaar per februari", value: "+12%"},
            {name: "Python ervaring", value: "+8%"}
        ],
        url: "/stage/1"
    },
    {
        id: 2,
        title: "Frontend Stagiair(e)",
        company: "DevCorp",
        location: "Rotterdam",
        matchPercentage: 92, // High match
        matchFactors: [
            {name: "React skills", value: "+30%"},
            {name: "Woonplaats", value: "+10%"},
            {name: "HTML/CSS", value: "+20%"}
        ],
        url: "/stage/2"
    },
    {
        id: 3,
        title: "Web Development Intern",
        company: "Innovate NL",
        location: "Utrecht",
        matchPercentage: 78,
        matchFactors: [
            {name: "React skills", value: "+20%"},
            {name: "Team fit", value: "+15%"}
        ],
        url: "/stage/3"
    }
];


// --- 3. THE PARENT LIST COMPONENT ---
const InternshipMatchingPage = () => {
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        // Right now, we load the hardcoded data.
        // LATER: Replace this block with a fetch() call to your database!

        // Sort the data from highest percentage to lowest before setting it
        const sortedData = [...mockInternships].sort((a, b) => b.matchPercentage - a.matchPercentage);
        setInternships(sortedData);
    }, []);

    return (
        <div style={{maxWidth: "600px", margin: "0 auto", padding: "20px"}}>
            <h2>Jouw Stage Matches</h2>

            {/* Loop through sorted internships and render a card for each */}
            {internships.map(stage => (
                <IntershipMatchesCard key={stage.id} internship={stage}/>
            ))}
        </div>
    );
};

export default InternshipMatchingPage;