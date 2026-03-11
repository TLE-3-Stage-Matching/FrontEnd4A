import React, {useState, useContext} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/login.css';

const LoginPage = () => {
    const {login} = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the role from the navigation state, with a fallback
    const role = location.state?.role || 'gebruiker';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoggingIn(true);

        try {
            // The login function in the context handles token, user state, and navigation
            await login(email, password);
            // On success, the useEffect in App.jsx will handle navigation
        } catch (err) {
            console.error("Login failed:", err.message);
            setError(err.message || "Login mislukt. Controleer uw gegevens.");
            setIsLoggingIn(false);
        }
    };

    const getRoleName = () => {
        switch (role) {
            case 'student':
                return 'Student';
            case 'company':
                return 'Stagebedrijf';
            case 'coordinator':
                return 'Stagecoördinator';
            default:
                return 'Gebruiker';
        }
    };

    return (
        <div className="login-form-container" style={{maxWidth: '400px', margin: '100px auto'}}>
            <button className="back-button" onClick={() => navigate('/')}>← Terug naar rollen</button>

            <h1>Login als {getRoleName()}</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="login-email">E-mailadres</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="login-password">Wachtwoord</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {error && <p className="error-message" style={{color: '#B02A37'}}>{error}</p>}

                <button type="submit" className="btn-primary" style={{width: '100%'}} disabled={isLoggingIn}>
                    {isLoggingIn ? 'Inloggen...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
