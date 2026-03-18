import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import * as api from '../api/client.js';

const StudentApplications = ({role = 'company'}) => {
    const {id} = useParams();

    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [rejectingApp, setRejectingApp] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let response;

                if (role === 'company') {
                    response = await api.getApplicationsForVacancy(id);
                } else if (role === 'coordinator') {
                    response = await api.getApplicationsForStudent(id);
                }

                setApplications(response.data || response);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Kon de sollicitaties niet ophalen van de server.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchApplications();
        }
    }, [id, role]);

    const handleInvite = (studentName, vacancyTitle) => {
        alert(`${studentName} is uitgenodigd voor de rol: ${vacancyTitle}!`);
    };

    const handleConfirmReject = () => {
        alert("Kandidaat afgewezen. Feedback is opgeslagen.");
        // CHANGED: Use app.id instead of app.application_id
        setApplications(applications.filter(app => app.id !== rejectingApp.id));
        setRejectingApp(null);
        setRejectReason("");
    };

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
                    // Safety fallbacks in case profile/prefs are missing
                    const profile = student?.student_profile || {};
                    const prefs = student?.student_preferences || {};

                    const displayName = profile.exclude_demographics
                        ? "Anonieme Kandidaat"
                        : `${student.first_name} ${student.last_name}`;

                    // CHANGED: Grab match_score from the v2 match_result object
                    const matchScore = app.match_result?.match_score || 0;
                    const matchColor = matchScore >= 70 ? "#729933" : "#e9bf5d";

                    return (
                        <article key={app.id} style={{ // CHANGED: app.id instead of application_id
                            border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px',
                            backgroundColor: 'white', display: 'flex', flexDirection: 'column',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
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
                                    <h4 style={{
                                        margin: '4px 0 0 0',
                                        color: '#111827'
                                    }}>{app.vacancy?.title || 'Onbekende Vacature'}</h4>
                                </div>
                                <div style={{
                                    backgroundColor: matchColor,
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}>
                                    {matchScore}% Match
                                </div>
                            </div>

                            <h3 style={{margin: '0 0 4px 0', color: '#1F2937'}}>{profile.headline || 'Student'}</h3>
                            <p style={{fontWeight: '600', color: '#4B5563', margin: '0 0 8px 0', fontSize: '14px'}}>
                                {displayName} {profile.city ? `• ${profile.city}` : ''}
                            </p>

                            {profile.bio && (
                                <p style={{
                                    color: '#374151',
                                    fontSize: '14px',
                                    marginBottom: '15px',
                                    fontStyle: 'italic'
                                }}>
                                    "{profile.bio}"
                                </p>
                            )}

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '15px'
                            }}>
                                <div>
                                    <h5 style={{
                                        margin: '0 0 6px 0',
                                        color: '#111827',
                                        fontSize: '12px',
                                        textTransform: 'uppercase'
                                    }}>Vaardigheden</h5>
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                        {student.student_tags?.map((st, i) => (
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

                                <div>
                                    <h5 style={{
                                        margin: '0 0 6px 0',
                                        color: '#111827',
                                        fontSize: '12px',
                                        textTransform: 'uppercase'
                                    }}>Talen</h5>
                                    <ul style={{margin: 0, paddingLeft: '15px', fontSize: '12px', color: '#4B5563'}}>
                                        {student.student_languages?.map((lang, i) => (
                                            <li key={i}>
                                                <strong>{lang.language.name}</strong> ({lang.language_level.name})</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: '#F9FAFB',
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '13px',
                                color: '#374151'
                            }}>
                                <strong>Beschikbaarheid:</strong> {prefs.hours_per_week_min || '-'} - {prefs.hours_per_week_max || '-'} uur/week <br/>
                                <strong>Rijbewijs:</strong> {prefs.has_drivers_license ? "Ja" : "Nee"}
                            </div>

                            {student.student_experiences?.length > 0 && (
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
                                            }}>{exp.start_date} t/m {exp.end_date || 'Heden'}</div>
                                            <div style={{fontSize: '13px', color: '#4B5563'}}>{exp.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                                {role === 'company' ? (
                                    <>
                                        <button onClick={() => handleInvite(displayName, app.vacancy?.title)} style={{
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
                        <p style={{fontSize: "14px", color: "#4B5563"}}>Geef een reden op. Dit helpt de student in hun
                            leerproces.</p>
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