import React, {useState, useContext} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import * as api from '../api/client';
import '../components/companydashboard.css';


const CompanyDashboard = () => {
    const {vacancies, deleteVacancy, logout} = useContext(AppContext);
    const navigate = useNavigate();

    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const closeModal = () => setSelectedVacancy(null);

    const handleVacancyClick = async (id) => {
        setIsModalLoading(true);
        try {
            const response = await api.getVacancy(id);
            setSelectedVacancy(response.data || response);
        } catch (error) {
            console.error("Failed to fetch vacancy details:", error);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Weet je zeker dat je de vacature "${title}" wilt verwijderen?`)) {
            deleteVacancy(id);
        }
    };

    return (

        <div className="dashboard-container">
            <header className="header-row">
                <div className="brand-section">
                    <h1>Bedrijf Dashboard</h1>
                    <p>Techno Innovators BV</p>
                </div>
                <div className="header-actions" style={{display: 'flex', gap: '10px'}}>
                    {/* De 'Profiel' button die als basis dient */}
                    <Link to="/profiel" className="btn-view-candidates" style={{textDecoration: 'none'}}>
                        PROFIEL
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        Uitloggen <span aria-hidden="true">⎋</span>
                    </button>
                </div>
            </header>

            <section className="stats-grid">
                <div className="stat-box"><h2>{vacancies.filter(v => v.status === 'Actief' || !v.status).length}</h2>
                    <p>Actieve vacatures</p></div>
                <div className="stat-box"><h2>{vacancies.length}</h2><p>Totale vacatures</p></div>
                <div className="stat-box"><h2>{vacancies.reduce((acc, v) => acc + (v.matches || 0), 0)}</h2><p>AI
                    matches</p></div>
            </section>

            <button
                className="btn-new-vacancy"
                onClick={() => navigate('/vacature/nieuw')}
            >
                + NIEUWE VACATURE PLAATSEN
            </button>

            <h2 style={{fontSize: '18px', marginBottom: '20px', fontWeight: '700'}}>MIJN VACATURES</h2>

            <div className="vacancy-list">
                {vacancies.map((vacancy) => (

                    <div key={vacancy.id} className="vacancy-card" onClick={() => handleVacancyClick(vacancy.id)}
                         style={{cursor: 'pointer'}}>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/vacature/${vacancy.id}/kandidaten`)
                                    }}
                                    aria-label={`Bekijk kandidaten voor ${vacancy.title}`}
                                    style={{marginTop: '10px'}}
                                >
                                    BEKIJK KANDIDATEN
                                </button>
                            </div>

                            <div className="action-buttons" style={{display: 'flex', gap: '10px'}}>
                                <button
                                    className="btn-action-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/vacature/bewerken/${vacancy.id}`)
                                    }}
                                    aria-label={`Bewerk ${vacancy.title}`}
                                >
                                    <span aria-hidden="true">✏️</span>
                                </button>
                                <button
                                    className="btn-action-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(vacancy.id, vacancy.title)
                                    }}
                                    aria-label={`Verwijder ${vacancy.title}`}
                                >
                                    <span aria-hidden="true">🗑️</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedVacancy && (
                <div
                    className="vacancy-modal-overlay"
                    onClick={(e) => {
                        // Only close if the background (overlay) itself is clicked
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="vacancy-modal-content">
                        <h2>{selectedVacancy.title}</h2>
                        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                            <span className="vacancy-badge">Status: {selectedVacancy.status || 'Open'}</span>
                            <span className="vacancy-badge">{selectedVacancy.hours_per_week} uur/week</span>
                        </div>

                        <h4>Beschrijving</h4>
                        <p>{selectedVacancy.description}</p>

                        {selectedVacancy.offer_text && (
                            <>
                                <h4>Wat wij bieden</h4>
                                <p>{selectedVacancy.offer_text}</p>
                            </>
                        )}

                        {selectedVacancy.expectations_text && (
                            <>
                                <h4>Verwachtingen</h4>
                                <p>{selectedVacancy.expectations_text}</p>
                            </>
                        )}

                        <h4>Gevraagde Vaardigheden (Tags)</h4>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px'}}>
                            {selectedVacancy.vacancy_requirements?.map(req => (
                                <span key={req.tag_id} className="vacancy-tag">
                        {req.tag.name}
                    </span>
                            ))}
                        </div>

                        <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
                            <button onClick={closeModal} className="btn-outline">
                                Sluiten
                            </button>
                            <button
                                onClick={() => navigate(`/vacature/bewerken/${selectedVacancy.id}`)}
                                className="btn-primary"
                            >
                                Bewerken
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDashboard;