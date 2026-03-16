import React, {useState} from 'react';
import './Login.css';

// Yas queen, let's define our component! Slay the DOM!
const Login = ({onLogin}) => {
    // Who are we today? Serving identity realness.
    const [selectedRole, setSelectedRole] = useState(null);
    // Are we serving fresh meat or a returning legend?
    const [isRegistering, setIsRegistering] = useState(false);

    // Serving state realness for our inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [school, setSchool] = useState(''); // New state for the academic divas
    const [error, setError] = useState('');

    // This function is the main character energy, handling the auth logic
    const handleAuth = (e) => {
        e.preventDefault(); // Stop that default behavior, we don't do basic here.
        setError('');

        if (isRegistering) {
            // We are creating a new moment.
            // Validation check - make sure the queens have their receipts
            let isValid = email && password && name;
            // Check if school is needed for the academic girlies (student & coordinator)
            if ((selectedRole === 'coordinator' || selectedRole === 'student') && !school) {
                isValid = false;
            }

            if (isValid) {
                // In a real app, we'd hit the API here.
                // For now, we just pretend we did it. Manifesting success.
                console.log(`Registered new ${selectedRole}: ${name} ${school ? 'at ' + school : ''}`);
                onLogin(selectedRole);
            } else {
                setError('Honey, you missed a spot. Fill in all fields.');
            }
        } else {
            // Tea time: checking the credentials (mock logic for now, bestie)
            if ((selectedRole === 'student' && email === 'student@school.com' && password === 'password') ||
                (selectedRole === 'company' && email === 'company@corp.com' && password === 'password') ||
                (selectedRole === 'coordinator' && email === 'coord@school.com' && password === 'password')) {
                // Access granted.
                onLogin(selectedRole);
            } else {
                // Oop- spilled the tea! Wrong credentials.
                setError('Invalid email or password. Not very demure of you.');
            }
        }
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setIsRegistering(false); // Reset to login default
        setError('');
        setEmail('');
        setPassword('');
        setName('');
        setSchool(''); // Clear the school drama
    };

    // Serving looks: The Landing Page Extravaganza!
    if (!selectedRole) {
        return (
            <div className="landing-container">
                {/* The crown jewel of the page */}
                <h1 className="landing-title">AI STAGE MATCHING PLATFORM</h1>
                <p className="landing-subtitle">Transparant &bull; Eerlijk &bull; Uitlegbaar</p>

                <h2 className="landing-prompt">Selecteer uw rol om door te gaan</h2>
                <hr className="landing-divider"/>

                <div className="cards-container">
                    {/* Student card: Main pop girl era */}
                    <div className="cards-container">
                        <button
                            className="role-card"
                            onClick={() => handleRoleSelect('student')}
                            aria-label="Student: Zoek stages en bekijk matches"
                        >
                            <div className="icon-circle" aria-hidden="true">
                                <svg>...</svg>
                            </div>
                            <h3>STUDENT</h3>
                            <p>Zoek stages en bekijk matches</p>
                        </button>
                    </div>
                    >

                    {/* Company card: CEO of matching, boss babe */}
                    <button className="role-card" onClick={() => handleRoleSelect('company')}
                            aria-label="Bedrijf: Zoekt gemotiveerde studenten om een stage aan te bieden">
                        <div className="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                <path d="M9 22v-4h6v4"></path>
                                <path d="M8 6h.01"></path>
                                <path d="M16 6h.01"></path>
                                <path d="M12 6h.01"></path>
                                <path d="M12 10h.01"></path>
                                <path d="M12 14h.01"></path>
                                <path d="M16 10h.01"></path>
                                <path d="M16 14h.01"></path>
                                <path d="M8 10h.01"></path>
                                <path d="M8 14h.01"></path>
                            </svg>
                        </div>
                        <h3>STAGEBEDRIJF</h3>
                        <p>Plaats opdrachten en vind studenten</p>
                    </button>

                    {/* Coordinator card: The one who organizes the chaos */}
                    <button className="role-card" onClick={() => handleRoleSelect('coordinator')}
                            aria-label="Stagecoördinator: Legt de link tussen student en bedrijf, begeleid studenten door hun stage heen">
                        <div className="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                        </div>
                        <h3>STAGECOÖRDINATOR</h3>
                        <p>Beheer matches en monitoring</p>
                    </button>
                </div>
            </div>
        );
    }

    // The final ru-veal: The Login/Register Form
    return (
        <div className="login-form-container">
            {/* Wait, reverse that. Back to the dressing room. */}
            <button className="back-button" onClick={() => setSelectedRole(null)}>← Terug naar rollen</button>

            <h2>{isRegistering ? 'Create Account' : 'Login'} to Slay
                als {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h2>

            <form onSubmit={handleAuth}>
                {isRegistering && (
                    <div className="form-group">
                        <label htmlFor="reg-name">
                            {selectedRole === 'company' ? 'Bedrijfsnaam:' : 'Volledige naam:'}
                        </label>
                        <input
                            id="reg-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>
                )}

                {/* Voeg ids en htmlFor toe aan Email en Password velden */}
                <div className="form-group">
                    <label htmlFor="auth-email">Email:</label>
                    <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                {/* Foutmelding met role="alert" */}
                {error && (
                    <p role="alert" style={{color: '#B02A37', fontWeight: 'bold', textAlign: 'center'}}>
                        {error}
                    </p>
                )}

                <button type="submit" className="submit-button">
                    {isRegistering ? 'Sign Up' : 'Log In'}
                </button>

                {/* Verander de klikbare <p> in een button voor keyboard support en target size */}
                <button
                    type="button"
                    className="link-style-button"
                    style={{
                        marginTop: '1rem',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer'
                    }}
                    onClick={() => setIsRegistering(!isRegistering)}
                >
                    {isRegistering ? 'Already have an account? Log In' : 'No account? Register here'}
                </button>
            </form>
        </div>
    );
};

export default Login;