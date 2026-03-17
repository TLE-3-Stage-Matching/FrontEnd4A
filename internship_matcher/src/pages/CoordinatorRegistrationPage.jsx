import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import * as api from '../api/client.js';
import '../components/CreateVacancy.css'; // Re-using styles for forms

const CoordinatorRegistrationPage = () => {
    // --- STATE ---
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {login} = useContext(AppContext);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.password_confirmation) {
            setError("Wachtwoorden komen niet overeen.");
            return;
        }

        setIsSubmitting(true);

        // The payload for coordinator registration is flat
        const payload = {
            ...formData,
        };

        try {
            await api.registerCoordinator(payload);

            // After successful registration, log the user in to get a token
            // and trigger the navigation and data fetching logic in App.jsx
            await login(formData.email, formData.password);

        } catch (err) {
            console.error("Coordinator registration failed:", err.message);
            setError(err.message || "Registratie is mislukt. Controleer de ingevoerde gegevens.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-vacancy-container" style={{maxWidth: '600px'}}>
            <div className="vacancy-form-header">
                <Link to="/login" className="btn-link back-to-dash-btn">&larr; Terug naar login</Link>
                <h1>Coördinator Registreren</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="first_name">Voornaam</label>
                        <input id="first_name" name="first_name" type="text" value={formData.first_name}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Achternaam</label>
                        <input id="last_name" name="last_name" type="text" value={formData.last_name}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                               required/>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Account</h2>
                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input id="password" name="password" type="password" value={formData.password}
                               onChange={handleChange} required minLength="8"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password_confirmation">Herhaal Wachtwoord</label>
                        <input id="password_confirmation" name="password_confirmation" type="password"
                               value={formData.password_confirmation} onChange={handleChange} required/>
                    </div>
                </div>

                {error && <p className="error-message" style={{color: '#B02A37', marginBottom: '20px'}}>{error}</p>}

                <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Registreren...' : 'Registreer en Log In'}
                </button>
            </form>
        </div>
    );
};

export default CoordinatorRegistrationPage;
