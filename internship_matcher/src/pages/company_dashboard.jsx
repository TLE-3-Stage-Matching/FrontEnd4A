// She's back and she's dynamic. We love a stateful queen.
import React, {useState, useContext} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';

const CompanyDashboard = () => {
    // --- HOOKS & CONTEXT ---
    // Getting the tea from the context.
    const {vacancies, deleteVacancy} = useContext(AppContext);
    const navigate = useNavigate();

    // State for managing which actions menu is open.
    const [openMenuId, setOpenMenuId] = useState(null);

    // Hardcoded stats for now, because she has other priorities.
    const stats = [
        {label: 'Actieve vacatures', value: vacancies.length},
        {label: 'Totale vacatures', value: 35},
        {label: 'AI matches', value: 23},
    ];

    // --- HANDLERS ---
    const handleToggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleEdit = (id) => {
        navigate(`/vacature/bewerken/${id}`);
    };

    const handleDelete = (id) => {
        deleteVacancy(id);
        setOpenMenuId(null); // Close the menu after deleting.
    };

    // --- RENDER ---
    return (
        <div className="dashboard-container">
            <header className="header-row">
                <div>
                    <h1>BEDRIJF DASHBOARD</h1>
                    <p>Techno Innovators BV</p>
                </div>
                <div className="header-actions">
                    <Link to="/profiel" className="btn-outline">Profiel</Link>
                    <button className="btn-logout">Uitloggen</button>
                </div>
            </header>

            {/* Stat Cards */}
            <div className="stats-row">
                {stats.map((stat, index) => (
                    <div className="stat-card" key={index}>
                        <h2>{stat.value}</h2>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </div>

            <button className="btn-primary" onClick={() => navigate('/vacature/nieuw')}>
                + NIEUWE VACATURE PLAATSEN
            </button>

            <h2>MIJN VACATURES</h2>
            <div className="vacancy-list">
                {/* Now we're mapping, darling. No more hardcoded nonsense. */}
                {vacancies.map((vacancy) => (
                    <div className="vacancy-item" key={vacancy.id}>
                        <div>
                            <h3>{vacancy.title} <span className="badge">Actief</span></h3>
                            <p>{vacancy.applications} sollicitaties | {vacancy.matches} AI Matches</p>
                            <button className="btn-outline">BEKIJK KANDIDATEN</button>
                        </div>
                        <div className="actions">
                            <button onClick={() => handleToggleMenu(vacancy.id)} className="actions-menu-btn">
                                &#x22EE; {/* The three vertical dots icon */}
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

            {/* The student section remains unbothered. */}
            {/* ... student match overview from the original file ... */}
        </div>
    );
};

export default CompanyDashboard;
