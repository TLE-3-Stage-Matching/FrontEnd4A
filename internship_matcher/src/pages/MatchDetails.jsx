import React from 'react';
import '../components/MatchDetails.css';

const MatchDetails = () => {
    return (
        <div className="match-container">
            <header className="match-header">
                <div className="user-profile">
                    <div className="avatar-circle">
                        <img src="https://via.placeholder.com/100" alt="User"/>
                    </div>
                    <p className="autonomy-text">
                        <strong>Jouw autonomie:</strong> Deze matches zijn AI-gegenereerd, maar je kunt altijd handmatig
                        zoeken en filters gebruiken.
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-search">🔍 handmatig zoeken</button>
                    <button className="btn-simulator">📊 Wat-als Simulator</button>
                    <button className="btn-logout">Log Uit</button>
                </div>
            </header>

            <main className="match-content">
                <button className="back-link">← Terug naar Matches</button>

                <div className="match-card">
                    <section className="card-header">
                        <h2>Junior Frontend developer</h2>
                        <p className="subtext">TechStart Amsterdam</p>

                        <div className="score-container">
                            <div className="score-label">
                                <span>Match score</span>
                                <span className="score-percentage">87%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: '87%'}}></div>
                            </div>
                        </div>
                    </section>

                    <section className="impact-list">
                        <div className="impact-item">
                            <strong>Skills Hoog gewicht</strong>
                            <p>Je hebt React ervaring</p>
                            <span className="impact-badge positive">Impact: +15%</span>
                        </div>
                        <div className="impact-item">
                            <strong>Beschikbaarheid Hoog gewicht</strong>
                            <p>Je bent beschikbaar in februari 2026</p>
                            <span className="impact-badge positive">Impact: +12%</span>
                        </div>
                        <div className="impact-item">
                            <strong>Mobiliteit Laag gewicht</strong>
                            <p>Geen rijbewijs B</p>
                            <span className="impact-badge negative">Impact: -5%</span>
                        </div>
                        <div className="impact-item">
                            <p>Bereikbaar met OV (45 min)</p>
                            <span className="impact-badge positive">Impact: +5%</span>
                        </div>
                    </section>

                    <section className="job-details">
                        <h3>Over de Stage</h3>
                        <p>We zoeken een gemotiveerde student voor een frontend development stage.</p>

                        <div className="requirements-grid">
                            <div>
                                <h4>Vereist:</h4>
                                <ul>
                                    <li>React</li>
                                    <li>JavaScript</li>
                                    <li>CSS</li>
                                </ul>
                            </div>
                            <div>
                                <h4>Nice-to-have:</h4>
                                <ul>
                                    <li>TypeScript</li>
                                    <li>Tailwind</li>
                                    <li>CSS</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <button className="btn-apply">Solliciteren</button>
                </div>
            </main>
        </div>
    );
};

export default MatchDetails;