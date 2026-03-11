import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css'; // For general layout
import '../components/CreateVacancy.css'; // For form styling

const CoordinatorDashboard = () => {
    // --- CONTEXT ---
    const {createStudentUser, isLoading, logout} = useContext(AppContext);

    // --- STATE ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- EFFECTS ---
    useEffect(() => {
        if (!isLoading) {
            console.log('Coordinator dashboard ingeladen!');
        }
    }, [isLoading]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // --- HANDLERS ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Gedrukt op: Account Aanmaken");

        const payload = {
            role: "student",
            email: email,
            password: password,
            first_name: firstName,
            last_name: lastName,
        };

        await createStudentUser(payload);

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setSuccessMessage("Student account succesvol aangemaakt. Geef de inloggegevens door aan de student.");
    };

    // --- RENDER ---
    if (isLoading) {
        return <div className="dashboard-container"><h1>Aan het laden...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>Coordinator Dashboard</h1>
                <div className="header-actions">
                    <Link to="/profiel" className="btn-outline">Profiel</Link>
                    <button onClick={logout} className="btn-logout">Uitloggen</button>
                </div>
            </header>

            <div className="form-section" style={{maxWidth: '600px', margin: '40px auto'}}>
                <h2>Student Account Aanmaken</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="first_name">Voornaam</label>
                        <input type="text" id="first_name" value={firstName}
                               onChange={(e) => setFirstName(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Achternaam</label>
                        <input type="text" id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                               required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                               required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input type="password" id="password" value={password}
                               onChange={(e) => setPassword(e.target.value)} required minLength="8"/>
                    </div>
                    <button type="submit" className="btn-primary" style={{width: '100%'}}>Account Aanmaken</button>
                </form>

                {successMessage && (
                    <div className="success-message" style={{marginTop: '20px', color: 'green', fontWeight: 'bold'}}>
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoordinatorDashboard;
