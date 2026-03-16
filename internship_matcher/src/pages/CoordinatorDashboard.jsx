import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';
import '../components/Dashboard.css';

const CoordinatorDashboard = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Alle');
    const [successMessage, setSuccessMessage] = useState('');
    const {isLoading, students = [], logout} = useContext(AppContext);

    useEffect(() => {
        document.title = "Coordinator Dashboard | KLIK";
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleLogout = async () => {
        try {
            if (logout) await logout();
            else localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const filteredStudents = Array.isArray(students)
        ? students.filter(s => filter === 'Alle' || s.status === filter)
        : [];

    if (isLoading) {
        return <div className="dashboard-container" aria-live="polite"><h1>Aan het laden...</h1></div>;
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
                    aria-label="Uitloggen uit het dashboard"
                >
                    Uitloggen
                </button>

                <Link to="/create/student" className="btn-add-student" role="button">
                    Student toevoegen
                </Link>

                <div className="user-profile">
                    <span>Jolene Van Curacao</span>
                    <img src="https://i.pravatar.cc/150?u=jolene" alt="Profielfoto van Jolene Van Curacao"
                         className="profile-img"/>
                </div>
            </header>

            <div className="info-banner" role="note" aria-label="Systeem informatie">
                <strong>Human-in-the-loop:</strong> de AI genereert match-voorstellen maar jij valideert deze voordat
                het definitief worden. Je behoudt altijd de volledige controle.
            </div>
            {successMessage && (
                <div role="alert" style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    {successMessage}
                </div>
            )}

            <section className="stats-grid" aria-label="Statistieken overzicht">
                <div className="stat-card">
                    <span>Bias waarschuwingen</span>
                    <span className="stat-number">1</span>
                </div>
                <div className="stat-card purple">
                    <span>Totale matches</span>
                    <span className="stat-number">{students.length}</span>
                </div>
            </section>


            <nav className="filter-bar" aria-label="Filter studenten op status">
                {['Alle', 'Te beoordelen', 'Goedgekeurd', 'Afgewezen'].map((item) => (
                    <button
                        key={item}
                        className={`filter-item ${filter === item ? 'active' : ''}`}
                        onClick={() => setFilter(item)}
                        aria-pressed={filter === item}
                        type="button"
                        style={{border: 'none', background: 'none', cursor: 'pointer', font: 'inherit'}}
                    >
                        {item}
                    </button>
                ))}
            </nav>

            <main className="student-list" aria-label="Overzicht van studenten">
                {filteredStudents.length > 0 ? (
                    <div role="list">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="student-row" role="listitem">
                                <div className="student-id-box">
                                    {student.name || `${student.first_name} ${student.last_name}`}
                                    <span className="sr-only"> ID: </span> {student.id}
                                </div>
                                <div className="job-info">
                                    <strong>{student.role}</strong><br/>
                                    <small style={{color: '#888'}}
                                           aria-label={`Bedrijf: ${student.company}`}>{student.company}</small>
                                </div>
                                <div className="match-pct" aria-label={`Match percentage: ${student.match} procent`}>
                                    {student.match}%
                                </div>
                                <div className="date" aria-label={`Datum van aanvraag: ${student.date}`}>
                                    {student.date}
                                </div>
                                <div className={`status-label ${student.statusClass}`}>
                                    <span className="sr-only">Status: </span>{student.status}
                                </div>
                                <Link to={`/student/${student.id}`} className="view-link"
                                      aria-label={`Bekijk details van ${student.name}`}>
                                    Bekijk
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div role="status"
                         style={{padding: '20px', textAlign: 'center', background: 'white', borderRadius: '8px'}}>
                        Geen studenten gevonden voor dit filter.
                    </div>
                )}
            </main>
        </div>
    );
};

export default CoordinatorDashboard;