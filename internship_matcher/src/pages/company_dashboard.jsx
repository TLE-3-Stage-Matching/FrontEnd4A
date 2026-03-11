// She's back and she's dynamic. And now she's loud.
import React, {useState, useContext, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';
import StudentApplications from "../components/StudentApplications.jsx";

const vacancies = [
    {id: 1, title: 'Frontend Developer Stagiair', applications: 12, matches: 8},
    {id: 2, title: 'UX/UI Design Stage', applications: 5, matches: 5},
    {id: 3, title: 'Backend Developer Stage', applications: 2, matches: 1},
];
const CompanyDashboard = () => {


    // --- HOOKS & CONTEXT ---
    const {vacancies, deleteVacancy, logout} = useContext(AppContext);
    const navigate = useNavigate();

    // State for managing which actions menu is open.
    const [openMenuId, setOpenMenuId] = useState(null);

    // Page load log
    useEffect(() => {
        console.log('Bedrijf dashboard ingeladen!');
    }, []);

    // Hardcoded stats for now.
    const stats = [
        {label: 'Actieve vacatures', value: vacancies.length},
        {label: 'Totale vacatures', value: 35},
        {label: 'AI matches', value: 23},
    ];

    // --- HANDLERS ---
    const handleToggleMenu = (id) => {
        console.log(`Gedrukt op: Actie menu voor vacature ID: ${id}`);
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleEdit = (id) => {
        console.log(`Gedrukt op: Bewerken voor vacature ID: ${id}`);
        navigate(`/vacature/bewerken/${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Gedrukt op: Verwijderen voor vacature ID: ${id}`);
        deleteVacancy(id);
        setOpenMenuId(null); // Close the menu after deleting.
    };

    const handleLogout = () => {
        console.log('Gedrukt op: Uitloggen');
        // The actual logout logic (which includes a confirm dialog) is in the context.
        logout();
    }

    // --- RENDER ---
    return (
        <div className="dashboard-container">
            <header className="header-row">
                <div>
                    <h1>BEDRIJF DASHBOARD</h1>
                    <p>Techno Innovators BV</p>
                </div>
                <div className="header-actions">
                    {/* The Link component doesn't have a simple onClick, so we'll log on the destination page */}
                    <Link to="/profiel" className="btn-outline"
                          onClick={() => console.log('Gedrukt op: Profiel knop')}>Profiel</Link>
                    <button onClick={handleLogout} className="btn-logout">Uitloggen</button>
                </div>
            </header>

            <div className="stats-row">
                {stats.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <h2>{stat.value}</h2>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>

            <button className="btn-primary" onClick={() => {
                console.log('Gedrukt op: + Nieuwe vacature plaatsen');
                navigate('/vacature/nieuw');
            }}>
                + NIEUWE VACATURE PLAATSEN
            </button>

            <h2>MIJN VACATURES</h2>
            <div className="vacancy-list">
                {vacancies.map((vacancy) => (
                    <div className="vacancy-item" key={vacancy.id}>
                        <div>
                            <h3>{vacancy.title} <span className="badge">Actief</span></h3>
                            <p>{vacancy.applications} sollicitaties | {vacancy.matches} AI Matches</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate(`/vacature/${vacancy.id}/kandidaten`)}
                            >
                                Bekijk Kandidaten
                            </button>
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
                ))}
            </div>
           
        </div>

    );
};

export default CompanyDashboard;
