// It's giving "Choose your player". This is where the journey begins.
import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';

// --- SVG Icons ---
// Simple, clean icons that do the job.
const StudentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);
const CompanyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
);
const CoordinatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9.5 9.5 5 5"/>
        <path d="m14.5 9.5-5 5"/>
    </svg>
);


const Home = () => {
    // We need the setUserRole function from the context to tell the app who we are.
    const {setUserRole} = useContext(AppContext);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setUserRole(role);
        // Navigate to the correct dashboard based on the chosen role.
        navigate(`/dashboard/${role}`);
    };

    return (
        <div className="role-selection-container">
            <h1>AI STAGE MATCHING PLATFORM</h1>
            <p className="subtitle">Transparant • Eerlijk • Uitlegbaar</p>
            <h2>Selecteer uw rol om door te gaan</h2>
            <div className="role-options">
                <button onClick={() => handleRoleSelect('student')} className="role-card">
                    <StudentIcon/>
                    <h3>STUDENT</h3>
                    <p>Zoek stages en bekijk matches</p>
                </button>
                <button onClick={() => handleRoleSelect('bedrijf')} className="role-card">
                    <CompanyIcon/>
                    <h3>STAGEBEDRIJF</h3>
                    <p>Plaats opdrachten en vind talenten</p>
                </button>
                <button onClick={() => handleRoleSelect('coordinator')} className="role-card">
                    <CoordinatorIcon/>
                    <h3>STAGECOÖRDINATOR</h3>
                    <p>Beheer matches en beoordelingen</p>
                </button>
            </div>
        </div>
    );
};

export default Home;
