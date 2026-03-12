import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css'; // For general layout
import '../components/Dashboard.css';

const CoordinatorDashboard = () => {

    const [filter, setFilter] = useState('Alle');
    // --- CONTEXT ---
    const {createStudentUser, isLoading} = useContext(AppContext);

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

    const filteredStudents = students.filter(s => filter === 'Alle' || s.status === filter);

    // --- RENDER ---
    if (isLoading) {
        return <div className="dashboard-container"><h1>Aan het laden...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="top-bar">
                <Link to="/" className="btn-add-student btn-back">
                    ← Terug naar homepage
                </Link>
                <Link to="/create/student" className="btn-add-student">
                    Student toevoegen
                </Link>
                <div className="user-profile">
                    <span>Jolene Van Curacao</span>
                    <img src="https://i.pravatar.cc/150?u=jolene" alt="Profile" className="profile-img"/>
                </div>
            </header>

            <div className="info-banner">
                Human-in-the-loop: de AI genereert match-voorstellen maar jij valideert deze voordat het definitief
                worden. Je behoudt altijd de volledige controle.
            </div>

            <section className="stats-grid">
                <div className="stat-card">
                    <span>Bias waarschuwingen</span>
                    <span className="stat-number">1</span>
                </div>
                <div className="stat-card">
                    <span>Te beoordelen</span>
                    <span className="stat-number">3</span>
                </div>
                <div className="stat-card">
                    <span>Goedgekeurd</span>
                    <span className="stat-number">2</span>
                </div>
                <div className="stat-card purple">
                    <span>Totale matches</span>
                    <span className="stat-number">{students.length}</span>
                </div>
            </section>

            <nav className="filter-bar">
                {['Alle', 'Te beoordelen', 'Goedgekeurd', 'Afgewezen'].map((item) => (
                    <div
                        key={item}
                        className={`filter-item ${filter === item ? 'active' : ''}`}
                        onClick={() => setFilter(item)}
                    >
                        {item}
                    </div>
                ))}
            </nav>

            <main className="student-list">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="student-row">
                        <div className="student-id-box">
                            {student.name} {student.id}
                        </div>
                        <div className="job-info">
                            <strong>{student.role}</strong><br/>
                            <small style={{color: '#888'}}>{student.company}</small>
                        </div>
                        <div className="match-pct">{student.match}%</div>
                        <div className="date">{student.date}</div>
                        <div className={`status-label ${student.statusClass}`}>
                            {student.status}
                        </div>
                        <Link to="#" className="view-link">Bekijk</Link>
                    </div>
                ))}
            </main>
        </div>

    );
};

export default CoordinatorDashboard;
