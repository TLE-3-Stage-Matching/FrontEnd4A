import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../components/companydashboard.css';

const CoordinatorDashboard = () => {
    useEffect(() => {
        console.log('Coordinator dashboard ingeladen!');
    }, []);

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>Coordinator Dashboard</h1>
                <Link to="/profiel" className="btn-outline"
                      onClick={() => console.log('Gedrukt op: Profiel knop')}>Profiel</Link>
            </header>
            <p>Welcome, coordinator! This is your dashboard.</p>
        </div>
    );
}

export default CoordinatorDashboard;
