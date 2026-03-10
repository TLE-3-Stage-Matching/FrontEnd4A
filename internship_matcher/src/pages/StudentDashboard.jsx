import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../components/companydashboard.css';

const StudentDashboard = () => {
    useEffect(() => {
        console.log('Student dashboard ingeladen!');
    }, []);

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>Student Dashboard</h1>
                <Link to="/profiel" className="btn-outline"
                      onClick={() => console.log('Gedrukt op: Profiel knop')}>Profiel</Link>
            </header>
            <p>Welcome, student! This is your dashboard.</p>
            <Link to="/vacatures" className="btn-primary" style={{marginTop: '2rem', display: 'inline-block'}}>
                Bekijk Beschikbare Stages
            </Link>
        </div>
    );
}

export default StudentDashboard;
