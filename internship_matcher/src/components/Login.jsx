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
                    <div className="role-card" onClick={() => handleRoleSelect('student')}>
                        <div className="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <h3>STUDENT</h3>
                        <p>Zoek stages en bekijk matches</p>
                    </div>

                    {/* Company card: CEO of matching, boss babe */}
                    <div className="role-card" onClick={() => handleRoleSelect('company')}>
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
                    </div>

                    {/* Coordinator card: The one who organizes the chaos */}
                    <div className="role-card" onClick={() => handleRoleSelect('coordinator')}>
                        <div className="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                        </div>
                        <h3>STAGECOÖRDINATOR</h3>
                        <p>Beheer matches en monitoring</p>
                    </div>
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
                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '.5rem'}}>
                            {selectedRole === 'company' ? 'Company Name:' : 'Full Name:'}
                        </label>
                        {/* What do we call you, legend? */}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{width: '100%', padding: '.5rem', boxSizing: 'border-box'}}
                        />
                    </div>
                )}

                {isRegistering && (selectedRole === 'coordinator' || selectedRole === 'student') && (
                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', marginBottom: '.5rem'}}>School / Institute:</label>
                        {/* Where do you rule, queen? */}
                        <input
                            type="text"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            required
                            style={{width: '100%', padding: '.5rem', boxSizing: 'border-box'}}
                        />
                    </div>
                )}

                <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '.5rem'}}>Email:</label>
                    {/* Slide into the DMs (input field) */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{width: '100%', padding: '.5rem', boxSizing: 'border-box'}}
                    />
                </div>

                <div style={{marginBottom: '1rem'}}>
                    <label style={{display: 'block', marginBottom: '.5rem'}}>Password:</label>
                    {/* Keep your secrets safe, hun */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: '100%', padding: '.5rem', boxSizing: 'border-box'}}
                    />
                </div>

                {/* Red flag alert if something goes wrong */}
                {error && <p style={{color: 'red'}}>{error}</p>}

                {/* Blast off to the dashboard */}
                <button type="submit" className="submit-button">
                    {isRegistering ? 'Sign Up' : 'Log In'}
                </button>

                {/* Switch it up */}
                <p style={{marginTop: '1rem', textAlign: 'center', cursor: 'pointer', color: '#007bff'}}
                   onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Already have an account? Log In' : 'No account? Register here'}
                </p>
            </form>
        </div>
    );
};

export default Login;