import {useState} from "react";

const StudentApplications = () => {

    const mockApplications = [
        {
            application_id: 102,
            match_percentage: 92,
            student: {
                id: 2,
                first_name: "Anna",
                middle_name: null,
                last_name: "Jansen",
                student_profile: {
                    headline: "Frontend Enthusiast",
                    bio: "Creative developer with a passion for beautiful and intuitive user interfaces.",
                    city: "Utrecht",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 3, name: "React", tag_type: "skill"}},
                    {tag: {id: 4, name: "CSS", tag_type: "skill"}},
                    {tag: {id: 5, name: "Figma", tag_type: "tool"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 36,
                    hours_per_week_max: 40,
                    has_drivers_license: true
                },
                student_experiences: []
            },
            vacancy: {id: 2, title: "Frontend Developer", status: "open", company: {name: "Creative Solutions"}}
        },
        {
            application_id: 103,
            match_percentage: 78,
            student: {
                id: 3,
                first_name: "Pieter",
                middle_name: null,
                last_name: "de Boer",
                student_profile: {
                    headline: "Full-Stack Aspirant",
                    bio: "Eager to learn both frontend and backend technologies to build complete web solutions.",
                    city: "Rotterdam",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 6, name: "Node.js", tag_type: "skill"}},
                    {tag: {id: 3, name: "React", tag_type: "skill"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Goed"}}
                ],
                student_preferences: {
                    hours_per_week_min: 32,
                    hours_per_week_max: 40,
                    has_drivers_license: false
                },
                student_experiences: [
                    {
                        id: 2,
                        title: "Web Developer Intern",
                        company_name: "Digital Agency",
                        start_date: "2023-09-01",
                        end_date: "2024-01-31",
                        description: "Assisted in developing WordPress sites for clients."
                    }
                ]
            },
            vacancy: {id: 3, title: "Full-Stack Intern", status: "open", company: {name: "Innovatech"}}
        },
        {
            application_id: 104,
            match_percentage: 65,
            student: {
                id: 4,
                first_name: "Fatima",
                middle_name: null,
                last_name: "El Amrani",
                student_profile: {
                    headline: "Data Science Student",
                    bio: "Analytical and detail-oriented, looking for opportunities in data analysis and machine learning.",
                    city: "Den Haag",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 7, name: "Python", tag_type: "skill"}},
                    {tag: {id: 8, name: "SQL", tag_type: "skill"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Vloeiend"}},
                    {language: {name: "Arabisch"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 24,
                    hours_per_week_max: 32,
                    has_drivers_license: true
                },
                student_experiences: []
            },
            vacancy: {id: 4, title: "Data Analyst Intern", status: "open", company: {name: "DataDriven Co."}}
        },
        {
            application_id: 105,
            match_percentage: 88,
            student: {
                id: 5,
                first_name: "Thomas",
                middle_name: null,
                last_name: "Visser",
                student_profile: {
                    headline: "Mobile App Developer",
                    bio: "Experience in building cross-platform mobile apps with React Native.",
                    city: "Eindhoven",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 9, name: "React Native", tag_type: "skill"}},
                    {tag: {id: 10, name: "JavaScript", tag_type: "skill"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 40,
                    hours_per_week_max: 40,
                    has_drivers_license: true
                },
                student_experiences: [
                    {
                        id: 3,
                        title: "Freelance App Developer",
                        company_name: "Self-employed",
                        start_date: "2023-06-01",
                        end_date: null,
                        description: "Developed a small-scale app for a local business."
                    }
                ]
            },
            vacancy: {id: 5, title: "Mobile Development Intern", status: "open", company: {name: "AppFactory"}}
        },
        {
            application_id: 106,
            match_percentage: 72,
            student: {
                id: 6,
                first_name: "Chantal",
                middle_name: null,
                last_name: "Groen",
                student_profile: {
                    headline: "Cybersecurity Enthusiast",
                    bio: "Interested in network security and ethical hacking.",
                    city: "Groningen",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 11, name: "Networking", tag_type: "skill"}},
                    {tag: {id: 12, name: "Linux", tag_type: "tool"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Goed"}}
                ],
                student_preferences: {
                    hours_per_week_min: 32,
                    hours_per_week_max: 40,
                    has_drivers_license: false
                },
                student_experiences: []
            },
            vacancy: {id: 6, title: "Security Operations Intern", status: "open", company: {name: "SecureNet"}}
        },
        {
            application_id: 107,
            match_percentage: 95,
            student: {
                id: 7,
                first_name: "Daan",
                middle_name: null,
                last_name: "Meijer",
                student_profile: {
                    headline: "Backend Developer",
                    bio: "Strong foundation in Java and Spring Boot, ready for a challenge.",
                    city: "Amsterdam",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 13, name: "Java", tag_type: "skill"}},
                    {tag: {id: 14, name: "Spring Boot", tag_type: "skill"}},
                    {tag: {id: 8, name: "SQL", tag_type: "skill"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 32,
                    hours_per_week_max: 40,
                    has_drivers_license: true
                },
                student_experiences: [
                    {
                        id: 4,
                        title: "Teaching Assistant",
                        company_name: "University of Amsterdam",
                        start_date: "2023-02-01",
                        end_date: "2023-06-30",
                        description: "Assisted with Java programming courses."
                    }
                ]
            },
            vacancy: {id: 1, title: "Backend developer", status: "open", company: {name: "Acme Corp"}}
        },
        {
            application_id: 108,
            match_percentage: 81,
            student: {
                id: 8,
                first_name: "Sophie",
                middle_name: null,
                last_name: "van der Berg",
                student_profile: {
                    headline: "UX/UI Designer",
                    bio: "Passionate about creating user-centered designs and prototypes.",
                    city: "Utrecht",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 5, name: "Figma", tag_type: "tool"}},
                    {tag: {id: 15, name: "User Research", tag_type: "skill"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 32,
                    hours_per_week_max: 40,
                    has_drivers_license: true
                },
                student_experiences: []
            },
            vacancy: {id: 7, title: "UX Design Intern", status: "open", company: {name: "UserFirst Design"}}
        },
        {
            application_id: 109,
            match_percentage: 75,
            student: {
                id: 9,
                first_name: "Lucas",
                middle_name: null,
                last_name: "Bakker",
                student_profile: {
                    headline: "Cloud Engineering Student",
                    bio: "Fascinated by cloud infrastructure and automation with AWS.",
                    city: "Rotterdam",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 16, name: "AWS", tag_type: "skill"}},
                    {tag: {id: 17, name: "Docker", tag_type: "tool"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Goed"}}
                ],
                student_preferences: {
                    hours_per_week_min: 36,
                    hours_per_week_max: 40,
                    has_drivers_license: false
                },
                student_experiences: []
            },
            vacancy: {id: 8, title: "DevOps Intern", status: "open", company: {name: "CloudNative B.V."}}
        },
        {
            application_id: 110,
            match_percentage: 90,
            student: {
                id: 10,
                first_name: "Eva",
                middle_name: null,
                last_name: "Smit",
                student_profile: {
                    headline: "Ambitious Frontend Developer",
                    bio: "Skilled in React and TypeScript, looking to contribute to a dynamic team.",
                    city: "Amsterdam",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 3, name: "React", tag_type: "skill"}},
                    {tag: {id: 18, name: "TypeScript", tag_type: "skill"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Moedertaal"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 32,
                    hours_per_week_max: 40,
                    has_drivers_license: true
                },
                student_experiences: [
                    {
                        id: 5,
                        title: "Web Development Intern",
                        company_name: "WebSolutions",
                        start_date: "2023-09-01",
                        end_date: "2024-02-28",
                        description: "Built and maintained React components for a large-scale e-commerce platform."
                    }
                ]
            },
            vacancy: {id: 2, title: "Frontend Developer", status: "open", company: {name: "Creative Solutions"}}
        },
        {
            application_id: 111,
            match_percentage: 68,
            student: {
                id: 11,
                first_name: "Mohammed",
                middle_name: null,
                last_name: "Ali",
                student_profile: {
                    headline: "Junior Project Manager",
                    bio: "Organized and communicative, with an interest in agile methodologies.",
                    city: "Den Haag",
                    exclude_demographics: false
                },
                student_tags: [
                    {tag: {id: 19, name: "Agile", tag_type: "methodology"}},
                    {tag: {id: 20, name: "Jira", tag_type: "tool"}}
                ],
                student_languages: [
                    {language: {name: "Nederlands"}, language_level: {name: "Vloeiend"}},
                    {language: {name: "Engels"}, language_level: {name: "Vloeiend"}}
                ],
                student_preferences: {
                    hours_per_week_min: 32,
                    hours_per_week_max: 40,
                    has_drivers_license: true
                },
                student_experiences: []
            },
            vacancy: {id: 9, title: "IT Project Management Intern", status: "open", company: {name: "ProcessPerfect"}}
        }
    ]
    const [applications, setApplications] = useState(mockApplications);

    // State for the Rejection Feedback Modal
    const [rejectingApp, setRejectingApp] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const handleInvite = (studentName, vacancyTitle) => {
        alert(`${studentName} is uitgenodigd voor de rol: ${vacancyTitle}!`);
        // LATER: Send POST request to update application status
    };

    const handleConfirmReject = () => {
        console.log("Afwijzing voor Applicatie ID:", rejectingApp.application_id, "Reden:", rejectReason);
        alert("Kandidaat afgewezen. Feedback is opgeslagen.");

        // Remove the rejected application from the screen
        setApplications(applications.filter(app => app.application_id !== rejectingApp.application_id));

        setRejectingApp(null);
        setRejectReason("");
    };

    return (<div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
            <h2>Inkomende Sollicitaties</h2>
            <p>Beoordeel de kandidaten inclusief hun ervaring, talen en beschikbaarheid.</p>

            {/* Changed Grid to allow wider cards since there is more info now */}
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

                            {/* --- AVAILABILITY & PREFERENCES --- */}
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

                            {/* --- ACTION BUTTONS (US #17) --- */}
                            <div style={{display: 'flex', gap: '10px', marginTop: 'auto'}}>
                                <button
                                    onClick={() => handleInvite(displayName, app.vacancy.title)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#9a5b86',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Uitnodigen
                                </button>
                                <button
                                    onClick={() => setRejectingApp(app)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: 'transparent',
                                        color: '#EF4444',
                                        border: '1px solid #EF4444',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Afwijzen
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* Rejection Modal Remains the same... */}
            {rejectingApp && (
                <div style={{
                    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex",
                    justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "400px"
                    }}>
                        <h3 style={{marginTop: 0}}>Kandidaat Afwijzen</h3>
                        <p style={{fontSize: "14px", color: "#4B5563"}}>
                            Geef een reden op voor de afwijzing voor de
                            rol <strong>{rejectingApp.vacancy.title}</strong>. Dit helpt de student in hun leerproces.
                        </p>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Bijv: We zoeken iemand met meer MySQL ervaring..."
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
                            <button
                                onClick={handleConfirmReject}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    backgroundColor: "#EF4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                Bevestig Afwijzing
                            </button>
                            <button
                                onClick={() => {
                                    setRejectingApp(null);
                                    setRejectReason("");
                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    backgroundColor: "#E5E7EB",
                                    color: "#374151",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
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