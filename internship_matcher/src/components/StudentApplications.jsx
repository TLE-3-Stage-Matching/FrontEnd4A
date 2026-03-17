import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import * as api from '../api/client.js'; // Import your API functions

const StudentApplications = ({role = 'company'}) => {
    // 1. Grab the ID from the URL (e.g., /vacature/2/kandidaten -> id is 2)
    const {id} = useParams();

    // 2. State to hold the data from the server
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the Rejection Feedback Modal
    const [rejectingApp, setRejectingApp] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    // 3. Fetch data from the server when the component loads
    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let response;

                // If a company is looking, fetch based on vacancy ID
                if (role === 'company') {
                    response = await api.getApplicationsForVacancy(id);
                }
                // If a coordinator is looking, fetch based on student ID
                else if (role === 'coordinator') {
                    response = await api.getApplicationsForStudent(id);
                }

                // Save the server data into our state
                // (Using response.data handles standard Laravel JSON wrappers)
                setApplications(response.data || response);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Kon de sollicitaties niet ophalen van de server.");
            } finally {
                setIsLoading(false); // Stop the loading spinner
            }
        };

        if (id) {
            fetchApplications();
        }
    }, [id, role]); // Rerun if ID or role changes

    // --- ACTION HANDLERS ---
    const handleInvite = (studentName, vacancyTitle) => {
        alert(`${studentName} is uitgenodigd voor de rol: ${vacancyTitle}!`);
        // LATER: Send a POST request to the server to update the application status
    };

    const handleConfirmReject = () => {
        alert("Kandidaat afgewezen. Feedback is opgeslagen.");
        // Remove from screen locally for now
        setApplications(applications.filter(app => app.application_id !== rejectingApp.application_id));
        setRejectingApp(null);
        setRejectReason("");
    };

    // --- CONDITIONAL RENDERING ---
    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '18px'}}>Data aan het laden...</div>;
    }

    if (error) {
        return <div style={{textAlign: 'center', padding: '50px', color: 'red'}}>{error}</div>;
    }

    if (applications.length === 0) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Geen sollicitaties gevonden voor dit ID.</div>;
    }

    return (
        <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
            {role === 'coordinator' && (
                <Link to={`/dashboard/coordinator`} className="view-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                         fill="#000000">
                        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                    </svg>
                </Link>
            )}

            {role === 'company' && (
                <Link to={`/dashboard/bedrijf`} className="view-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                         fill="#000000">
                        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                    </svg>
                </Link>
            )}


            {/* Dynamic Titles */}
            <h2>{role === 'coordinator' ? "Stage Overzicht Student" : "Inkomende Sollicitaties"}</h2>
            <p>
                {role === 'coordinator'
                    ? "Controleer of de stage en het bedrijf voldoen aan de eisen van de opleiding."
                    : "Beoordeel de kandidaten inclusief hun ervaring, talen en beschikbaarheid."}
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                {applications.map(app => {
                    const student = app.student;
                    const profile = student.student_profile;
                    const prefs = student.student_preferences;

                    const displayName = profile.exclude_demographics
                        ? "Anonieme Kandidaat"
                        : `${student.first_name} ${student.last_name}`;

                    const matchColor = app.match_percentage >= 70 ? "#729933" : "#e9bf5d";

                    return (
                        <article key={app.application_id} style={{
                            border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px',
                            backgroundColor: 'white', display: 'flex', flexDirection: 'column',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            {/* --- HEADER: Vacancy & Match --- */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                borderBottom: '1px solid #E5E7EB',
                                paddingBottom: '10px',
                                marginBottom: '15px'
                            }}>
                                <div>
                                    <span style={{fontSize: '12px', color: '#6B7280', fontWeight: 'bold'}}>GESOLLICITEERD VOOR</span>
                                    <h4 style={{margin: '4px 0 0 0', color: '#111827'}}>{app.vacancy.title}</h4>
                                </div>
                                <div style={{
                                    backgroundColor: matchColor,
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    {app.match_percentage}% Match
                                </div>
                            </div>

                            {/* --- STUDENT INTRO --- */}
                            <h3 style={{margin: '0 0 4px 0', color: '#1F2937'}}>{profile.headline}</h3>
                            <p style={{fontWeight: '600', color: '#4B5563', margin: '0 0 8px 0', fontSize: '14px'}}>
                                {displayName} • {profile.city}
                            </p>
                            <p style={{color: '#374151', fontSize: '14px', marginBottom: '15px', fontStyle: 'italic'}}>
                                "{profile.bio}"
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '15px'
                            }}>
                                {/* --- SKILLS --- */}
                                <div>
                                    <h5 style={{
                                        margin: '0 0 6px 0',
                                        color: '#111827',
                                        fontSize: '12px',
                                        textTransform: 'uppercase'
                                    }}>Vaardigheden</h5>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                        {student.student_tags.map((st, i) => (
                                            <span key={i} style={{
                                                backgroundColor: '#EFF6FF',
                                                color: '#1E40AF',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '12px'
                                            }}>
                                                {st.tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* --- LANGUAGES --- */}
                                <div>
                                    <h5 style={{
                                        margin: '0 0 6px 0',
                                        color: '#111827',
                                        fontSize: '12px',
                                        textTransform: 'uppercase'
                                    }}>Talen</h5>
                                    <ul style={{margin: 0, paddingLeft: '15px', fontSize: '12px', color: '#4B5563'}}>
                                        {student.student_languages.map((lang, i) => (
                                            <li key={i}>
                                                <strong>{lang.language.name}</strong> ({lang.language_level.name})</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* --- AVAILABILITY --- */}
                            <div style={{
                                backgroundColor: '#F9FAFB',
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '13px',
                                color: '#374151'
                            }}>
                                <strong>Beschikbaarheid:</strong> {prefs.hours_per_week_min} - {prefs.hours_per_week_max} uur/week <br/>
                                <strong>Rijbewijs:</strong> {prefs.has_drivers_license ? "Ja" : "Nee"}
                            </div>

                            {/* --- WORK EXPERIENCE --- */}
                            <div style={{marginBottom: '20px'}}>
                                <h5 style={{
                                    margin: '0 0 8px 0',
                                    color: '#111827',
                                    fontSize: '12px',
                                    textTransform: 'uppercase'
                                }}>Relevante Ervaring</h5>
                                {student.student_experiences.map(exp => (
                                    <div key={exp.id} style={{
                                        marginBottom: '10px',
                                        paddingLeft: '10px',
                                        borderLeft: '3px solid #E5E7EB'
                                    }}>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            color: '#1F2937'
                                        }}>{exp.title} bij {exp.company_name}</div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#6B7280',
                                            marginBottom: '4px'
                                        }}>{exp.start_date} t/m {exp.end_date}</div>
                                        <div style={{fontSize: '13px', color: '#4B5563'}}>{exp.description}</div>
                                    </div>
                                ))}
                            </div>

                            {/* --- ACTION BUTTONS (Dynamic by Role) --- */}
                            <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                                {role === 'company' ? (
                                    <>
                                        <button onClick={() => handleInvite(displayName, app.vacancy.title)} style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: '#9a5b86',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                            Uitnodigen
                                        </button>
                                        <button onClick={() => setRejectingApp(app)} style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: 'transparent',
                                            color: '#EF4444',
                                            border: '1px solid #EF4444',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                            Afwijzen
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => alert("Stage Goedgekeurd door school!")} style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: '#729933',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                            Goedkeuren
                                        </button>
                                        <button onClick={() => setRejectingApp(app)} style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: 'transparent',
                                            color: '#EF4444',
                                            border: '1px solid #EF4444',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}>
                                            Afkeuren
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Rejection Modal */}
            {rejectingApp && (
                <div style={{
                    position: "fixed",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "400px"
                    }}>
                        <h3 style={{marginTop: 0}}>{role === 'company' ? 'Kandidaat Afwijzen' : 'Stage Afkeuren'}</h3>
                        <p style={{fontSize: "14px", color: "#4B5563"}}>
                            Geef een reden op. Dit helpt de student in hun leerproces.
                        </p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reden voor afwijzing..."
                            style={{
                                width: "100%",
                                height: "100px",
                                padding: "10px",
                                marginTop: "10px",
                                borderRadius: "6px",
                                border: "1px solid #D1D5DB"
                            }}
                        />
                        <div style={{display: "flex", gap: "10px", marginTop: "20px"}}>
                            <button onClick={handleConfirmReject} style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: "#EF4444",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}>
                                Bevestig
                            </button>
                            <button onClick={() => {
                                setRejectingApp(null);
                                setRejectReason("");
                            }} style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: "#E5E7EB",
                                color: "#374151",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}>
                                Annuleren
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default StudentApplications;