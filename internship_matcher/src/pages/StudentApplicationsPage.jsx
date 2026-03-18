import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import * as api from '../api/client.js';
import '../components/companydashboard.css'; // Reusing styles

const StudentApplicationsPage = () => {
    const {studentId} = useParams();
    const [student, setStudent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch student details and their applications in parallel
                const [studentRes, appsRes] = await Promise.all([
                    api.getUser(studentId),
                    api.getStudentApplications(studentId)
                ]);
                setStudent(studentRes.data);
                // The API might return the applications directly or wrapped in a data property
                setApplications(appsRes.data || appsRes);
            } catch (err) {
                console.error("Failed to fetch student data:", err);
                setError("Kon de gegevens van de student niet laden.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    if (isLoading) {
        return <div className="dashboard-container"><h1>Gegevens worden geladen...</h1></div>;
    }

    if (error) {
        return <div className="dashboard-container"><h1>Fout</h1><p>{error}</p></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <div>
                    <h1>Sollicitaties van {student?.first_name} {student?.last_name}</h1>
                    <p>{student?.email}</p>
                </div>
                <Link to="/dashboard/coordinator" className="btn-outline">Terug naar Dashboard</Link>
            </header>

            <div className="vacancy-list">
                {(applications && applications.length > 0) ? applications.map(app => (
                    <div className="vacancy-item" key={app.id}>
                        <div>
                            <h3>{app.vacancy?.title || 'Onbekende Vacature'}</h3>
                            <p>{app.vacancy?.company?.name || 'Onbekend Bedrijf'}</p>
                            {/* Placeholder for status, as API structure is not fully known */}
                            <span className="badge">Status: {app.status || 'In behandeling'}</span>
                        </div>
                        <div className="actions">
                            {/* Placeholder for future actions */}
                            <button className="btn-outline">Bekijk Match Details</button>
                        </div>
                    </div>
                )) : (
                    <p>Deze student heeft nog geen sollicitaties.</p>
                )}
            </div>
        </div>
    );
};

export default StudentApplicationsPage;
