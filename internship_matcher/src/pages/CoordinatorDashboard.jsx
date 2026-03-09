import React from 'react';
import {Link} from 'react-router-dom';

const CoordinatorDashboard = () => (
    <div className="dashboard-container">
        <header className="header-row">
            <h1>Coordinator Dashboard</h1>
            <Link to="/profiel" className="btn-outline">Profiel</Link>
        </header>
        <p>Welcome, coordinator! This is your dashboard.</p>
    </div>
);

export default CoordinatorDashboard;
