import React, {useState} from "react";
import InternshipMatchesCard from "./InternshipMatchesCard";


// --- 1. MOCK DATA ---
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
    {
        id: 2,
        title: "UX/UI Design Stagiair(e)",
        company: "CreativePixels",
        location: "Rotterdam",
        matchPercentage: 94,
        matchFactors: [
            {name: "Figma ervaring", value: "+30%"},
            {name: "Portfolio", value: "+15%"},
            {name: "Woonplaats", value: "+5%"}
        ],
        about: "Ben jij creatief en houd je van pixel-perfect designs? Help ons met het ontwerpen van intuïtieve gebruikerservaringen.",
        Vereist: [
            {name: "Figma"},
            {name: "Adobe XD"},
            {name: "CSS"},
            {name: "Design Thinking"}
        ],
        url: "/stage/2"
    },
    {
        id: 3,
        title: "Fullstack Web Intern",
        company: "Innovate NL",
        location: "Utrecht",
        matchPercentage: 67,
        matchFactors: [
            {name: "Node.js kennis", value: "+20%"},
            {name: "Team fit", value: "+15%"}
        ],
        about: "Draai mee in een agile team en leer hoe je zowel de frontend als de backend van complexe systemen koppelt.",
        Vereist: [
            {name: "React"},
            {name: "Javascript"},
            {name: "Node.js"},
            {name: "SQL"}
        ],
        url: "/stage/3"
    },
    {
        id: 4,
        title: "Mobile App Developer",
        company: "AppMakers",
        location: "Den Haag",
        matchPercentage: 45,
        matchFactors: [
            {name: "Beschikbaar per direct", value: "+25%"},
            {name: "React Native", value: "+10%"}
        ],
        about: "Tijdens deze stage bouw je mee aan iOS en Android apps voor grote e-commerce klanten in Nederland.",
        Vereist: [
            {name: "React Native"},
            {name: "Javascript"},
            {name: "Git"}
        ],
        url: "/stage/4"
    },
    {
        id: 5,
        title: "E-commerce IT Stagiair",
        company: "ShopTech",
        location: "Eindhoven",
        matchPercentage: 81,
        matchFactors: [
            {name: "E-commerce interesse", value: "+18%"},
            {name: "PHP basics", value: "+14%"},
            {name: "Communicatie", value: "+10%"}
        ],
        about: "Ondersteun onze webshops door het schrijven van nieuwe features en het optimaliseren van de laadsnelheid.",
        Vereist: [
            {name: "PHP"},
            {name: "HTML/CSS"},
            {name: "MySQL"},
            {name: "SEO basis"}
        ],
        url: "/stage/5"
    },
    {
        id: 6,
        title: "Junior Vue Developer",
        company: "GreenTech Solutions",
        location: "Groningen",
        matchPercentage: 73,
        matchFactors: [
            {name: "Vue.js", value: "+22%"},
            {name: "Duurzaamheid affiniteit", value: "+12%"}
        ],
        about: "Werk aan software die bedrijven helpt hun CO2-uitstoot te meten. Vue.js ervaring is een grote plus!",
        Vereist: [
            {name: "Vue.js"},
            {name: "Javascript"},
            {name: "SASS"},
            {name: "Git"}
        ],
        url: "/stage/6"
    }
];

const MatchesDetails = () => {
    // 1. The memory for the list of internships
    const [internships, setInternships] = useState(mockInternships);

    // 2. The memory for the popup modal
    const [selectedInternship, setSelectedInternship] = useState(null);

    return (
        <div>
            <h2>Jouw Stage Matches</h2>

            {/* The List of Cards */}
            <div className="card-list">
                {internships.map(stage => (
                    <InternshipMatchesCard
                        key={stage.id}
                        internship={stage}
                        onSelect={setSelectedInternship} // Passing the function down!
                    />
                ))}
            </div>

            {/* The Pop-up Modal (Conditional Rendering) */}
            {selectedInternship && (
                <div style={{
                    position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, 0)",
                    backgroundColor: "white", padding: "40px", border: "1px solid black",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)", zIndex: 1000
                }}>
                    <h3>Gedetailleerde Analyse voor:</h3>
                    <p>Match Percentage: {selectedInternship.matchPercentage}%</p>
                    <h2>{selectedInternship.title}</h2>
                    <p>Bedrijf: {selectedInternship.company}</p>
                    <p>Locatie: {selectedInternship.location}</p>
                    <h6>over deze stage</h6>
                    <p>{selectedInternship.about}</p>
                    <h5>Vereisten:</h5>
                    <ul>
                        {selectedInternship.Vereist.map((skill, index) => (
                            <li key={index}>{skill.name}</li>
                        ))}
                    </ul>


                    {/* A button to close the modal by setting the memory back to null */}
                    <button onClick={() => setSelectedInternship(null)}>
                        Sluit venster
                    </button>
                </div>
            )}
        </div>
    );
};

export default MatchesDetails;