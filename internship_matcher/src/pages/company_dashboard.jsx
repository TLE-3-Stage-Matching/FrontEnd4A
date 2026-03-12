import React, {useState, useContext, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';

const CompanyDashboard = () => {
    // --- HOOKS & CONTEXT ---
    const {user, vacancies, deleteVacancy, logout, isLoading} = useContext(AppContext);
    const navigate = useNavigate();

    const [openMenuId, setOpenMenuId] = useState(null);

    // --- EFFECTS ---
    useEffect(() => {
        if (!isLoading) {
            console.log('Bedrijf dashboard ingeladen met live data.');
        }
    }, [isLoading]);

    // --- HANDLERS ---
    const handleToggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);
    const handleEdit = (id) => navigate(`/vacature/bewerken/${id}`);
    const handleDelete = (id) => {
        deleteVacancy(id);
        setOpenMenuId(null);
    };

    // --- RENDER ---
    if (isLoading) {
        return <div className="dashboard-container"><h1>Vacatures worden geladen...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <div>
                    <h1>BEDRIJF DASHBOARD</h1>
                    {/* Display company name dynamically from context */}
                    {user?.company && <p>{user.company.name}</p>}
                </div>
                <div className="header-actions">
                    <Link to="/profiel" className="btn-outline">Profiel</Link>
                    <button onClick={logout} className="btn-logout">Uitloggen</button>
                </div>
            </header>

            {/* Stats are now also more dynamic */}
            <div className="stats-row">
                <div className="stat-card"><h2>{vacancies.length}</h2><p>Actieve vacatures</p></div>
                <div className="stat-card"><h2>{vacancies.length}</h2><p>Totale vacatures</p></div>
                <div className="stat-card"><h2>0</h2><p>AI matches (placeholder)</p></div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/vacature/nieuw')}>
                + NIEUWE VACATURE PLAATSEN
            </button>

            <h2>MIJN VACATURES</h2>
            <div className="vacancy-list">
                {vacancies.length > 0 ? (
                    vacancies.map((vacancy) => (
                        <div className="vacancy-item" key={vacancy.id}>
                            <div>
                                <h3>{vacancy.title} <span className="badge">{vacancy.status || 'Actief'}</span></h3>
                                <p>Sollicitaties: {vacancy.applications_count || 0} | AI
                                    Matches: {vacancy.matches_count || 0}</p>
                                <button className="btn-outline">BEKIJK KANDIDATEN</button>
                            </div>
                            <div className="actions">
                                <button onClick={() => handleToggleMenu(vacancy.id)} className="actions-menu-btn"
                                        aria-label="Open acties menu">
                                    &#x22EE;
                                </button>
                                {openMenuId === vacancy.id && (
                                    <div className="actions-menu">
                                        <button onClick={() => handleEdit(vacancy.id)}>Bewerken</button>
                                        <button onClick={() => handleDelete(vacancy.id)}>Verwijderen</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>U heeft nog geen vacatures geplaatst.</p>
                )}
            </div>
        </div>
    );
};

export default CompanyDashboard;
