import React, {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";
import {AppContext} from "../context/AppContext";
import * as api from "../api/client";
import "../components/Sandbox.css";

const Sandbox = () => {
    const {id} = useParams();
    const {saveLearningGoal, tags: allAvailableTags, studentProfile} = useContext(AppContext);

    const [vacancy, setVacancy] = useState(null);
    const [activeTags, setActiveTags] = useState([]);
    const [matchResults, setMatchResults] = useState({percentage: 0, recommendations: []});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (studentProfile?.student_tags) {
            const initialTags = studentProfile.student_tags
                .filter(t => t.tag_type === 'skill' || t.tag_type === 'trait')
                .map(t => ({
                    tag_id: t.tag_id || t.id,
                    weight: t.weight || 3
                }));
            setActiveTags(initialTags);
        }
    }, [studentProfile]);

    // 2. De "Live" API koppeling
    useEffect(() => {
        if (!id) return;

        const syncSandbox = async () => {
            try {
                const response = await api.getSandboxVacancyDetail(id, activeTags);
                console.log("Ruwe API Response:", response); // Check je console (F12)

                // De v2 API nest de resultaten vaak onder 'data'
                const result = response.data || response;

                if (result) {
                    // Update vacature (sommige velden kunnen veranderen door de sandbox)
                    if (result.vacancy) setVacancy(result.vacancy);

                    setMatchResults({
                        // Check of de API 'match_score' of 'score' gebruikt
                        percentage: result.match_score !== undefined ? result.match_score : (result.score || 0),
                        // Check voor 'recommendations' of 'missing_tags'
                        recommendations: result.recommendations || result.missing_tags || []
                    });
                }
            } catch (err) {
                console.error("Sandbox sync error:", err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(syncSandbox, 300);
        return () => clearTimeout(timeoutId);
    }, [id, activeTags]);

    const toggleTag = (tagId) => {
        setActiveTags(prev => {
            const exists = prev.find(t => t.tag_id === tagId);
            if (exists) {
                return prev.filter(t => t.tag_id !== tagId);
            } else {
                if (prev.length >= 10) return prev;
                return [...prev, {tag_id: tagId, weight: 3}];
            }
        });
    };

    if (loading && !vacancy) return <div className="loader">Simulator laden...</div>;

    const isPassing = matchResults.percentage >= (vacancy?.min_match || 80);
    const progressColor = isPassing ? "#729933" : "#E9BF5D";

    return (
        <div className="sandbox-container">
            <div className="sandbox-header">
                <Link to="/vacatures" className="sandbox-back-link">← Terug naar Vacatures</Link>
                <div className="sandbox-title-group">
                    <h1>Wat-als Simulator</h1>
                    <span className="sandbox-badge">SANDBOX MODUS</span>
                </div>
            </div>

            <div className="sandbox-layout">
                {/* LINKS: De editor */}
                <div className="sandbox-card">
                    <h3>Experimenteer met Skills</h3>
                    <p className="hint">Klik op skills om te zien wat het doet met je score.</p>
                    <div className="skills-scroll-box">
                        {allAvailableTags
                            .filter(t => t.tag_type === 'skill')
                            .map(tag => {
                                const isActive = activeTags.some(at => at.tag_id === tag.id);
                                return (
                                    <div key={tag.id} className="skill-row">
                                        <span>{tag.name}</span>
                                        <div
                                            className={`toggle-switch ${isActive ? 'active' : ''}`}
                                            onClick={() => toggleTag(tag.id)}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* RECHTS: De live resultaten van de API */}
                <div className="sandbox-right-col">
                    <div className="sandbox-card impact-card">
                        <div className="impact-header">
                            <h3>{vacancy?.title}</h3>
                            <span className="company-label">{vacancy?.company?.name}</span>
                        </div>

                        <div className="score-display">
                            <div className="score-circle" style={{borderColor: progressColor}}>
                                <span className="score-value">{matchResults.percentage}%</span>
                                <span className="score-label">Match</span>
                            </div>
                        </div>

                        <div className="progress-container">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{width: `${matchResults.percentage}%`, backgroundColor: progressColor}}
                                />
                            </div>
                            <p className="status-msg" style={{color: progressColor}}>
                                {isPassing ? "✓ Je voldoet aan de eisen" : "⚠ Je komt nog tekort"}
                            </p>
                        </div>
                    </div>

                    <div className="sandbox-card">
                        <h3>Verbeterpunten</h3>
                        <p className="hint">De API adviseert deze skills voor deze vacature:</p>
                        <div className="recommendations-list">
                            {matchResults.recommendations.length > 0 ? (
                                matchResults.recommendations.map(rec => (
                                    <div key={rec.id} className="recommendation-item">
                                        <div className="rec-info">
                                            <span className="rec-name">{rec.name}</span>
                                            <span className="rec-type">{rec.tag_type}</span>
                                        </div>
                                        <button
                                            className="save-goal-btn"
                                            onClick={() => saveLearningGoal(vacancy, rec)}
                                        >
                                            Leerdoel +
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-msg">Je bent de perfecte match!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sandbox;