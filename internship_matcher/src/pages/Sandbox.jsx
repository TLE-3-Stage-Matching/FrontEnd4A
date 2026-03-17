import React, {useState, useMemo} from "react";
import {Link, useParams} from "react-router-dom";

// --- 1. MOCK DATA (Gebaseerd op je wireframe) ---
const vacancy = {
    id: 99,
    title: "Back-end Stage - Python/Spring Boot (Java) Developer",
    company: {name: "Erogon Media"},
    minMatch: 80,
    requirements: [
        {id: 1, name: 'Python', importance: 1},
        {id: 2, name: 'SQL', importance: 1},
        {id: 3, name: 'Django', importance: 1},
        {id: 4, name: 'Figma', importance: 0},
        {id: 5, name: 'NextJS', importance: 0},
        {id: 6, name: 'Spring Boot', importance: 1},
        {id: 7, name: 'Docker', importance: 1},
        {id: 8, name: 'Kubernetes', importance: 0},
        {id: 9, name: 'Git', importance: 1},
        {id: 10, name: 'Agile/Scrum', importance: 0},
    ]
};

const Sandbox = () => {
    const {id} = useParams();

    // --- 2. STATE ---
    const [activeSkillIds, setActiveSkillIds] = useState([1, 3, 6]);

    // --- 3. DE REKENMACHINE ---
    const matchData = useMemo(() => {
        let totalPossiblePoints = 0;
        let studentPoints = 0;
        let recommendations = [];

        vacancy.requirements.forEach(req => {
            const pointsValue = req.importance === 1 ? 2 : 1;
            totalPossiblePoints += pointsValue;

            if (activeSkillIds.includes(req.id)) {
                studentPoints += pointsValue;
            } else {
                recommendations.push({
                    id: req.id,
                    name: req.name,
                    potentialPoints: pointsValue
                });
            }
        });

        const percentage = totalPossiblePoints === 0 ? 0 : Math.round((studentPoints / totalPossiblePoints) * 100);

        const formattedRecs = recommendations.map(rec => ({
            ...rec,
            percentGain: Math.round((rec.potentialPoints / totalPossiblePoints) * 100)
        })).sort((a, b) => b.percentGain - a.percentGain);

        return {percentage, recommendations: formattedRecs};
    }, [activeSkillIds]);

    // --- 4. TOGGLE ACTION ---
    const toggleSkill = (skillId) => {
        setActiveSkillIds(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        );
    };

    // Dynamische kleuren voor de progress bar (CSS variabelen matchen)
    const isPassing = matchData.percentage >= vacancy.minMatch;
    const progressColor = isPassing ? "var(--green, #729933)" : "var(--yellow, #E9BF5D)";

    return (
        <div className="sandbox-container">

            {/* Header */}
            <div className="sandbox-header">
                <Link to="/matches" className="sandbox-back-link">
                    ← Terug naar Matches
                </Link>
                <div className="sandbox-title-group">
                    <h1>Wat-als Simulator</h1>
                    <span>Experimenteer met je profiel om te zien hoe dit je match-kansen beïnvloedt</span>
                </div>
            </div>

            <div className="sandbox-content">

                {/* Info Banner */}
                <div className="info-banner">
                    <div className="info-icon">i</div>
                    <p><strong>Sandbox-omgeving:</strong> Wijzigingen hier zijn tijdelijk en beïnvloeden je echte
                        profiel niet. Gebruik deze tool om te experimenteren en te leren welke skills of criteria je
                        kansen vergroten.</p>
                </div>

                {/* Two Column Layout */}
                <div className="sandbox-layout">

                    {/* LEFT COLUMN: Toggles */}
                    <div className="sandbox-card">
                        <h3>Pas je profiel aan</h3>
                        <h4>Skills & Competenties</h4>

                        {/* DIT IS DE NIEUWE SCROLL WRAPPER */}
                        <div className="skills-scroll-box">
                            {vacancy.requirements.map(req => {
                                const isActive = activeSkillIds.includes(req.id);
                                return (
                                    <div key={req.id} className="skill-row">
                                        <span>{req.name}</span>
                                        {/* Toggle Switch */}
                                        <div
                                            className={`toggle-switch ${isActive ? 'active' : ''}`}
                                            onClick={() => toggleSkill(req.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {/* EINDE SCROLL WRAPPER */}


                    </div>

                    {/* RIGHT COLUMN: Results */}
                    <div className="sandbox-right-col">

                        {/* Impact Card */}
                        <div className="sandbox-card">
                            <h3>Impact op stage</h3>

                            <div className="impact-summary">
                                <div className="job-title">{vacancy.title}</div>
                                <div className="company-name">{vacancy.company.name}</div>
                                <div className="min-match">Minimale match vereist: {vacancy.minMatch}%</div>
                            </div>

                            <div className="score-row">
                                <span className="label">Match score</span>
                                <span className="value">{matchData.percentage}%</span>
                            </div>

                            {/* Progress Bar (Inline styles for dynamic width/color) */}
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${matchData.percentage}%`,
                                        backgroundColor: progressColor
                                    }}
                                />
                            </div>

                            <div className="status-text" style={{color: progressColor}}>
                                {isPassing ? "Je voldoet aan de minimale eis!" : "Je voldoet nog niet aan de minimale eis."}
                            </div>
                        </div>

                        {/* Recommendations Card */}
                        <div className="sandbox-card">
                            <h3>Aanbevelingen om je score te verhogen</h3>

                            {matchData.recommendations.length > 0 ? (
                                matchData.recommendations.map(rec => (
                                    <div key={rec.id} className="recommendation-row">
                                        <span>Leer <strong>{rec.name}</strong></span>
                                        <span className="gain">+{rec.percentGain}%</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{color: '#666', fontStyle: 'italic', fontSize: '14px'}}>
                                    Je hebt alle gevraagde skills voor deze vacature geselecteerd!
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sandbox;