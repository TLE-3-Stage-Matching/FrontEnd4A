import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';
import '../components/Dashboard.css';

const CoordinatorDashboard = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [filter, setFilter] = useState('Alle');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- CONTEXT ---
    const {createStudentUser, isLoading, students = [], logout} = useContext(AppContext);

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
    const handleLogout = async () => {
        try {
            if (logout) {
                await logout();
            } else {
                // Fallback als logout niet in context zit
                localStorage.removeItem('token');
            }
            navigate('/login');
        } catch (error) {
            console.error("Uitloggen mislukt:", error);
            // Zelfs bij error token verwijderen en redirecten
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        setSuccessMessage("Student account succesvol aangemaakt.");
    };

    // --- LOGIC ---
    const filteredStudents = Array.isArray(students)
        ? students.filter(s => filter === 'Alle' || s.status === filter)
        : [];

    // --- RENDER ---
    if (isLoading) {
        return (
            <div className="dashboard-container">
                <h1>Aan het laden...</h1>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="top-bar">
                <div className="brand-section">
                    <h1>Coordinator Dashboard</h1>
                    <p>Hogeschool nogwat</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn-add-student btn-back"
                    style={{cursor: 'pointer', border: 'none'}}
                >
                    Uitloggen
                </button>

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
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div key={student.id} className="student-row">
                            <div className="student-id-box">
                                {student.name || `${student.first_name} ${student.last_name}`} {student.id}
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
                    ))
                ) : (
                    <div style={{padding: '20px', textAlign: 'center', background: 'white', borderRadius: '8px'}}>
                        Geen studenten gevonden voor dit filter.
                    </div>
                )}
            </main>
        </div>
    );
};

export default CoordinatorDashboard;