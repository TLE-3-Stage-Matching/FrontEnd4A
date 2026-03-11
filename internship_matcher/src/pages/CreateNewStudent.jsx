import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/Dashboard.css';

const CreateStudent = () => {
    const {createStudentUser, isLoading} = useContext(AppContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            role: "student",
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        };

        await createStudentUser(payload);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setSuccessMessage("Student account succesvol aangemaakt.");
    };

    if (isLoading) return <div className="dashboard-container"><h1>Aan het laden...</h1></div>;

    return (
        <div className="dashboard-container">
            <header className="top-bar">
                <Link to="/dashboard/coordinator" className="btn-add-student btn-back">
                    ← Terug naar Dashboard
                </Link>
                <div className="user-profile">
                    <span>Jolene Van Curacao</span>
                    <img src="https://i.pravatar.cc/150?u=jolene" alt="Profile" className="profile-img"/>
                </div>
            </header>

            <div className="form-container">
                <h2 style={{color: 'var(--purple-main)', marginBottom: '25px'}}>Nieuwe Student Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Voornaam</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>Achternaam</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>E-mailadres</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>Wachtwoord</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                               minLength="8"/>
                    </div>
                    <button type="submit" className="btn-add-student" style={{width: '100%', marginTop: '10px'}}>
                        Account Aanmaken
                    </button>
                </form>

                {successMessage && (
                    <div style={{marginTop: '20px', color: '#27ae60', fontWeight: 'bold', textAlign: 'center'}}>
                        {successMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateStudent;