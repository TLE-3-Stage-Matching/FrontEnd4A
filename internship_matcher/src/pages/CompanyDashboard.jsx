import React from 'react';
import '../components/companydashboard.css';

const CompanyDashboard = () => {
    const vacancies = [
        {id: 1, title: 'Frontend Developer Stagiair', apps: 12, matches: 8, status: 'Actief'},
        {id: 2, title: 'UX/UI Design Stage', apps: 8, matches: 5, status: 'Actief'},
        {id: 3, title: 'Backend Developer Stage', apps: 15, matches: 10, status: 'Gesloten'}
    ];

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <div className="brand-section">
                    <h1>BEDRIJF DASHBOARD</h1>
                    <p>Techn Innovators BV</p>
                </div>
                <button className="btn-logout">Uitloggen ⎋</button>
            </header>

            {/* Goudkleurige header blokken met consistente schaduw */}
            <section className="stats-grid">
                <div className="stat-box">
                    <h2>3</h2>
                    <p>Active vacatures</p>
                </div>
                <div className="stat-box">
                    <h2>35</h2>
                    <p>Totale vacatures</p>
                </div>
                <div className="stat-box">
                    <h2>23</h2>
                    <p>AI matches</p>
                </div>
            </section>

            <button className="btn-new-vacancy" style={{backgroundColor: '#1a252f', color: 'white'}}>
                + NIEUWE VACATURE PLAATSEN
            </button>

            <h2 style={{fontSize: '18px', marginBottom: '20px', fontWeight: '700'}}>MIJN VACATURES</h2>

            <div className="vacancy-list">
                {vacancies.map((job) => (
                    <div key={job.id} className="vacancy-card">
                        {/* Verfijnd paars blok (afgerond) */}
                        <div className="vacancy-side-block">
                            <h3>{job.title}</h3>
                        </div>

                        <div className="vacancy-main-content">
                            <div>
                                <span className={job.status === 'Actief' ? 'tag-active' : 'tag-closed'}>
                                    {job.status}
                                </span>
                                <div className="meta-info" style={{marginTop: '8px', fontSize: '13px', color: '#888'}}>
                                    👥 {job.apps} sollicitaties &nbsp;&nbsp; ✨ {job.matches} AI matches
                                </div>
                                <button className="btn-view-candidates">BEKIJK KANDIDATEN</button>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-action-icon">✏️</button>
                                <button className="btn-action-icon">🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyDashboard;