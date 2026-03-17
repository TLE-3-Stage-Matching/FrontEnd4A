// A page for introspection and profile management.
import React, {useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {useNavigate, Link} from 'react-router-dom';
import '../components/companydashboard.css';
import '../App.css';

const Profile = () => {
    // Get the full user object and logout function from the context.
    const {user, logout} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log(`Profielpagina geladen voor gebruiker: ${user.first_name} (${user.role})`);
        }
    }, [user]);

    const getRoleName = () => {
        switch (user?.role) {
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

    const handleDeleteClick = () => {
        logout();
    }

    if (!user) {
        return <div className="dashboard-container"><h1>Profiel laden...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>{getRoleName()} Profiel</h1>
                <button onClick={() => navigate(-1)} className="btn-outline">
                    Terug
                </button>
            </header>

            <div className="profile-content">
                <p>Ingelogd als: <strong>{user.email}</strong></p>
                <p>Naam: <strong>{user.first_name} {user.last_name}</strong></p>
                <br/>

                {/* Show edit skills button only for students */}
                {user.role === 'student' && (
                    <Link to="/onboarding/student" className="btn-primary" style={{marginBottom: '20px'}}>
                        Mijn Skills Aanpassen
                    </Link>
                )}

                <p>Hier zouden de verdere profielgegevens en bewerk-opties komen te staan.</p>

                <button onClick={handleDeleteClick} className="btn-danger">Verwijder en Log Uit</button>
            </div>
        </div>
    );
};

export default Profile;
