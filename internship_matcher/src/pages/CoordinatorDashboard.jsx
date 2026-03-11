import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import '../components/Dashboard.css';

const CoordinatorDashboard = () => {
    const [filter, setFilter] = useState('Alle');

    const students = [
        {
            id: '1082617',
            name: 'Student A',
            role: 'Junior Frontend developer',
            company: 'Techstart amsterdam',
            match: 87,
            date: '2026-05-07',
            status: 'Te beoordelen',
            statusClass: 'status-pending'
        },
        {
            id: '1089090',
            name: 'Student B',
            role: 'UX/UI Design Stagiar',
            company: 'Creative studio Rotterdam',
            match: 72,
            date: '2026-05-08',
            status: 'Goedgekeurd',
            statusClass: 'status-approved'
        },
        {
            id: '1088876',
            name: 'Student C',
            role: 'Senior developer Stagiar',
            company: 'EliteTech Corp',
            match: 65,
            date: '2026-05-09',
            status: 'Te beoordelen',
            statusClass: 'status-pending'
        },
        {
            id: '1082656',
            name: 'Student D',
            role: 'Full stack developer',
            company: 'InnovatieTech Utrecht',
            match: 55,
            date: '2026-05-10',
            status: 'Afgewezen',
            statusClass: 'status-rejected'
        },
        {
            id: '1081525',
            name: 'Student E',
            role: 'AI Engineer Stagiar',
            company: 'PrestigeIT',
            match: 91,
            date: '2026-05-11',
            status: 'Te beoordelen',
            statusClass: 'status-pending'
        },
    ];

    const filteredStudents = students.filter(s => filter === 'Alle' || s.status === filter);

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