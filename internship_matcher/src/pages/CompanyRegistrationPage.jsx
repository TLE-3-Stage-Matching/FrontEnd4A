import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import * as api from '../api/client.js';
import '../components/CreateVacancy.css'; // Re-using styles for forms

const CompanyRegistrationPage = () => {
    // --- STATE ---
    // Using a single state object to hold all form data
    const [formData, setFormData] = useState({
        companyName: '',
        city: '',
        country: 'Netherlands', // Default value
        userFirstName: '',
        userLastName: '',
        userEmail: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {login} = useContext(AppContext);
    const navigate = useNavigate();

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

        // Construct the nested payload required by the API
        const payload = {
            company: {
                name: formData.companyName,
            },
            location: {
                city: formData.city,
                country: formData.country,
            },
            user: {
                email: formData.userEmail,
                first_name: formData.userFirstName,
                last_name: formData.userLastName,
            },
            password: formData.password,
            password_confirmation: formData.password_confirmation,
        };

        try {
            // The registration endpoint also returns a token for immediate login
            const response = await api.registerCompany(payload);

            // After successful registration, use the existing login flow
            // to set the token and fetch the user, triggering navigation.
            await login(formData.userEmail, formData.password);

        } catch (err) {
            console.error("Registration failed:", err.message);
            setError(err.message || "Registratie is mislukt. Controleer de ingevoerde gegevens.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-vacancy-container" style={{maxWidth: '600px'}}>
            <div className="vacancy-form-header">
                <Link to="/login" className="btn-link back-to-dash-btn">&larr; Terug naar login</Link>
                <h1>Bedrijf Registreren</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Bedrijfsgegevens</h2>
                    <div className="form-group">
                        <label htmlFor="companyName">Bedrijfsnaam</label>
                        <input id="companyName" name="companyName" type="text" value={formData.companyName}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">Stad</label>
                        <input id="city" name="city" type="text" value={formData.city} onChange={handleChange}
                               required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Land</label>
                        <input id="country" name="country" type="text" value={formData.country} onChange={handleChange}
                               required/>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Contactpersoon</h2>
                    <div className="form-group">
                        <label htmlFor="userFirstName">Voornaam</label>
                        <input id="userFirstName" name="userFirstName" type="text" value={formData.userFirstName}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="userLastName">Achternaam</label>
                        <input id="userLastName" name="userLastName" type="text" value={formData.userLastName}
                               onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="userEmail">E-mailadres</label>
                        <input id="userEmail" name="userEmail" type="email" value={formData.userEmail}
                               onChange={handleChange} required/>
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

export default CompanyRegistrationPage;
