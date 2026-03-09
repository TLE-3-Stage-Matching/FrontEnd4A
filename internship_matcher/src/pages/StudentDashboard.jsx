import React from 'react';
import {Link} from 'react-router-dom';

const StudentDashboard = () => (
    <div className="dashboard-container">
        <header className="header-row">
            <h1>Student Dashboard</h1>
            <Link to="/profiel" className="btn-outline">Profiel</Link>
        </header>
        <p>Welcome, student! This is your dashboard.</p>
    </div>
);

export default StudentDashboard;
