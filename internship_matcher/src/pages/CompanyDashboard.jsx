import React, {useState, useContext, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';

const CompanyDashboard = () => {
    // --- 1. LOGIC & CONTEXT (From File 1) ---
    const {vacancies, deleteVacancy, logout} = useContext(AppContext);
    const navigate = useNavigate();

    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        console.log('Bedrijf dashboard ingeladen!');
    }, []);

    // Derived stats
    const activeCount = vacancies.filter(v => v.status === 'Actief' || !v.status).length;
    const totalMatches = vacancies.reduce((acc, v) => acc + (v.matches || 0), 0);

    // --- 2. HANDLERS ---
    const handleLogout = () => {
        console.log('Gedrukt op: Uitloggen');
        logout();
    };

    const handleDelete = (id) => {
        if (window.confirm("Weet je zeker dat je deze vacature wilt verwijderen?")) {
            deleteVacancy(id);
        }
    };

    const handleEdit = (id) => {
        navigate(`/vacature/bewerken/${id}`);
    };

    return (
        <div className="dashboard-container">
            {/* --- HEADER SECTION --- */}
            <header className="header-row">
                <div className="brand-section">
                    <h1>BEDRIJF DASHBOARD</h1>
                    <p>Techno Innovators BV</p>
                </div>
                <div className="header-actions" style={{display: 'flex', gap: '10px'}}>
                    <Link to="/profiel" className="btn-view-candidates"
                          style={{textDecoration: 'none', lineHeight: '20px'}}>
                        PROFIEL
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">Uitloggen ⎋</button>
                </div>
            </header>

            {/* --- STATS SECTION (Gold accent style) --- */}
            <section className="stats-grid">
                <div className="stat-box">
                    <h2>{activeCount}</h2>
                    <p>Actieve vacatures</p>
                </div>
                <div className="stat-box">
                    <h2>{vacancies.length}</h2>
                    <p>Totale vacatures</p>
                </div>
                <div className="stat-box">
                    <h2>{totalMatches}</h2>
                    <p>AI matches</p>
                </div>
            </section>

            {/* --- ACTION BUTTON --- */}
            <button
                className="btn-new-vacancy"
                style={{
                    backgroundColor: '#1a252f',
                    color: 'white',
                    border: 'none',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '30px',
                    fontWeight: 'bold'
                }}
                onClick={() => navigate('/vacature/nieuw')}
            >
                + NIEUWE VACATURE PLAATSEN
            </button>

            <h2 style={{fontSize: '18px', marginBottom: '20px', fontWeight: '700'}}>MIJN VACATURES</h2>

            {/* --- VACANCY LIST (Purple side-block style) --- */}
            <div className="vacancy-list">
                {vacancies.map((vacancy) => (
                    <div key={vacancy.id} className="vacancy-card">

                        {/* Purple rounded block */}
                        <div className="vacancy-side-block">
                            <h3>{vacancy.title}</h3>
                        </div>

                        <div className="vacancy-main-content">
                            <div>
                                <span className={vacancy.status === 'Gesloten' ? 'tag-closed' : 'tag-active'}>
                                    {vacancy.status || 'Actief'}
                                </span>
                                <div className="meta-info" style={{marginTop: '8px', fontSize: '13px', color: '#888'}}>
                                    👥 {vacancy.applications || 0} sollicitaties &nbsp;&nbsp; ✨ {vacancy.matches || 0} AI
                                    matches
                                </div>
                                <button
                                    className="btn-view-candidates"
                                    onClick={() => navigate(`/vacature/${vacancy.id}/kandidaten`)}
                                    style={{marginTop: '10px'}}
                                >
                                    BEKIJK KANDIDATEN
                                </button>
                            </div>

                            {/* Action Buttons from File 2 style */}
                            <div className="action-buttons" style={{display: 'flex', gap: '10px'}}>
                                <button
                                    className="btn-action-icon"
                                    onClick={() => handleEdit(vacancy.id)}
                                    title="Bewerken"
                                    style={{background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer'}}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-action-icon"
                                    onClick={() => handleDelete(vacancy.id)}
                                    title="Verwijderen"
                                    style={{background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer'}}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyDashboard;