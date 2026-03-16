import React, {useState, useContext} from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/login.css';

const LoginPage = () => {
    const {login} = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

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
            await login(email, password);
        } catch (err) {
            console.error("Login failed:", err.message);
            setError(err.message || "Login mislukt. Controleer uw gegevens.");
        } finally {
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
        <main className="login-form-container">
            <button
                className="back-button"
                onClick={() => navigate('/')}
                aria-label="Terug naar de rol-selectie pagina"
            >
                ← Terug naar rollen
            </button>

            <h1>Login als {getRoleName()}</h1>

            <form onSubmit={handleSubmit} noValidate={false}>
                <div className="form-group">
                    <label htmlFor="login-email">E-mailadres</label>
                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        /* 3.3.1: Als er een error is, koppel deze aan het veld */
                        aria-invalid={error ? "true" : "false"}
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
                        aria-invalid={error ? "true" : "false"}
                    />
                </div>

                {/* 4.1.3: role="alert" zorgt dat de error direct wordt voorgelezen */}
                {error && (
                    <p
                        className="error-message"
                        role="alert"
                        style={{color: '#B02A37', textAlign: 'center', fontWeight: 'bold'}}
                    >
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoggingIn}
                    aria-busy={isLoggingIn}
                >
                    {isLoggingIn ? 'Inloggen...' : 'Login'}
                </button>
            </form>

            {role === 'company' && (
                <div className="register-link">
                    <p>Nog geen account? <Link to="/register/bedrijf">Registreer uw bedrijf hier</Link>.</p>
                </div>
            )}

            {role === 'coordinator' && (
                <div className="register-link">
                    <p>Nog geen account? <Link to="/register/coordinator">Registreer hier als coördinator</Link>.</p>
                </div>
            )}
        </main>
    );
};

export default LoginPage;