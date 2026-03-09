// We're importing React, because we're not just developers, we're artists.
import React from 'react';
// And the CSS? That's our glam squad.
import './CompanyDashboard.css';

// This is where the magic happens, hun. The main stage.
const CompanyDashboard = ({onViewChange}) => {
    // Hardcoded data because we're not about that database life... yet.
    // This is our little black book of vacancies.
    const stats = [
        {label: 'Active vacatures', value: 3},
        {label: 'Totale vacatures', value: 35},
        {label: 'AI matches', value: 23},
    ];

    const vacancies = [
        {title: 'Frontend Developer Stagiair', applications: 12, matches: 8},
        {title: 'UX/UI Design Stage', applications: 5, matches: 5},
        {title: 'Backend Developer Stage', applications: 2, matches: 1},
    ];

    // Serving Full House realness with this component structure.
    return (
        <div className="dashboard-container">
            {/* The grand entrance. */}
            <header className="dashboard-header">
                <h1>Company Dashboard</h1>
                {/* A button that says "I'm ready for my close-up." */}
                <button onClick={() => onViewChange('create')} className="btn btn-primary">
                    Nieuwe vacature plaatsen
                </button>
            </header>

            {/* Spilling the tea with these stats. Numbers, darling, numbers! */}
            <section className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Now for the main event: My Vacancies. It's giving "booked and busy." */}
            <section className="vacancies-section">
                <h2>Mijn Vacatures</h2>
                <ul className="vacancy-list">
                    {vacancies.map((vacancy, index) => (
                        <li key={index} className="vacancy-item">
                            <div className="vacancy-info">
                                <h3>{vacancy.title}</h3>
                                <div className="vacancy-meta">
                                    <span>{vacancy.applications} Sollicitaties</span>
                                    <span>{vacancy.matches} AI Matches</span>
                                </div>
                            </div>
                            <button className="btn btn-secondary">Bekijk Details</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

// And... scene. Export it, let the world see the vision.
export default CompanyDashboard;
