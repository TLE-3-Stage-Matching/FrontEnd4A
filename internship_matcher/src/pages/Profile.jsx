// It's giving "Know thyself". A page for introspection.
import React, {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {useNavigate} from 'react-router-dom';
import '../components/companydashboard.css';
import '../App.css';

const Profile = () => {
    // Get the user role and logout function from the context. It's the tea.
    const {userRole, logout} = useContext(AppContext);
    const navigate = useNavigate();

    // If no one's logged in, why are we even here? Go home.
    if (!userRole) {
        navigate('/');
        return null; // Don't render anything, just navigate away.
    }

    // A simple function to get the full role name. We're fancy like that.
    const getRoleName = () => {
        switch (userRole) {
            case 'student':
                return 'Student';
            case 'company':
                return 'Bedrijf';
            case 'coordinator':
                return 'Stagecoördinator';
            default:
                return 'Gebruiker';
        }
    };

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>{getRoleName()} Profiel</h1>
                <button onClick={() => navigate(-1)} className="btn-outline">Terug</button>
            </header>

            <div className="profile-content">
                <p>Dit is de profielpagina voor de rol: <strong>{getRoleName()}</strong>.</p>
                <p>Hier zouden de profielgegevens en bewerk-opties komen te staan.</p>
                <button onClick={logout} className="btn-danger">Verwijder profiel</button>
            </div>
        </div>
    );
};

export default Profile;
