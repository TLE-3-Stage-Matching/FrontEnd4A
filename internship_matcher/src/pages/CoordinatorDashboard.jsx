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
                    filteredStudents.map((student) => {
                        // Safe fallback for properties that might be nested or missing in real data
                        const profile = student.student_profile || {};
                        const statusText = profile.searching_status || "Actief"; // Assuming a default status

                        return (
                            <div key={student.id} className="student-row">
                                <div className="student-id-box">
                                    {/* Uses real backend fields: first_name and last_name */}
                                    {student.first_name} {student.last_name}
                                    <span style={{color: '#888', marginLeft: '8px'}}>#{student.id}</span>
                                </div>

                                <div className="job-info">
                                    {/* Fallback to headline or email since students don't have a 'company' yet */}
                                    <strong>{profile.headline || 'Student'}</strong><br/>
                                    <small style={{color: '#888'}}>{student.email}</small>
                                </div>

                                {/* Match percentage is not directly on student, so keep as '-' or fetch separately */}
                                <div className="match-pct">-</div>

                                {/* Use created_at from the student object */}
                                <div className="date">
                                    {student.created_at ? new Date(student.created_at).toLocaleDateString() : '-'}
                                </div>

                                <div className="status-label">
                                    {statusText}
                                </div>

                                {/* Dynamic link to the Student Applications page */}
                                <Link to={`/coordinator/student/${student.id}`} className="view-link">
                                    Bekijk
                                </Link>
                            </div>
                        );
                    })
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