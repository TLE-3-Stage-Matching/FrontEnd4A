import React, {useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/companydashboard.css';
import LearningGoals from "../components/LearningGoals.jsx";

const StudentDashboard = () => {
    const {logout} = useContext(AppContext);

    useEffect(() => {
        console.log('Student dashboard ingeladen!');
    }, []);

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>Student Dashboard</h1>
                <div className="header-actions">
                    <Link to="/profiel" className="btn-outline">Profiel</Link>
                    <button onClick={logout} className="btn-logout">Uitloggen</button>
                </div>
            </header>
            <p>Welcome, student! This is your dashboard.</p>
            <Link to="/vacatures" className="btn-primary" style={{marginTop: '2rem', display: 'inline-block'}}>
                Bekijk Beschikbare Stages
            </Link>
            <LearningGoals/>
        </div>
    );
}

export default StudentDashboard;
