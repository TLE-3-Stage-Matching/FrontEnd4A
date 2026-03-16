import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';

// Minimalistische SVG's: puur decoratief, dus volledig verborgen voor hulpsoftware
const StudentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

const CompanyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
);

const CoordinatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9.5 9.5 5 5"/>
        <path d="m14.5 9.5-5 5"/>
    </svg>
);

const HomePage = () => {
    const {isAuthenticated, user, isLoading} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Home | KLIK AI Stage Matching";

        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = "KLIK AI Stage Matching: Het platform voor transparante, eerlijke en uitlegbare matches tussen studenten, stagebedrijven en coördinatoren.";

        if (!isLoading && isAuthenticated && user) {
        }
    }, [isAuthenticated, user, isLoading, navigate]);

    const handleRoleSelect = (role) => {
        navigate('/login', {state: {role}});
    };

    return (
        <main className="role-selection-container">
            <h1>KLIK</h1>
            <p className="subtitle">Transparant • Eerlijk • Uitlegbaar</p>
            <h2>Selecteer uw rol om door te gaan</h2>

            <div className="role-options">
                <button
                    onClick={() => handleRoleSelect('student')}
                    className="role-card"
                    aria-label="Student: Zoek stages en bekijk matches"
                >
                    <StudentIcon/>
                    <h3>STUDENT</h3>
                    <p>Zoek stages en bekijk matches</p>
                </button>

                <button
                    onClick={() => handleRoleSelect('company')}
                    className="role-card"
                    aria-label="Stagebedrijf: Plaats opdrachten en vind talenten"
                >
                    <CompanyIcon/>
                    <h3>STAGEBEDRIJF</h3>
                    <p>Plaats opdrachten en vind talenten</p>
                </button>

                <button
                    onClick={() => handleRoleSelect('coordinator')}
                    className="role-card"
                    aria-label="Stagecoördinator: Beheer matches en beoordelingen"
                >
                    <CoordinatorIcon/>
                    <h3>STAGECOÖRDINATOR</h3>
                    <p>Beheer matches en beoordelingen</p>
                </button>
            </div>
        </main>
    );
};

export default HomePage;