import React, {useEffect, useState} from 'react';
import StudentCard from "../components/student_card.jsx";
import '../components/companydashboard.css';


const CompanyDashboard = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const studentsData = [
            {id: 1, name: "Jan de Vries", matchPercentage: 85, skills: ["React", "CSS"]},
            {id: 2, name: "Anouk Schilder", matchPercentage: 94, skills: ["JavaScript", "Figma"]},
            {id: 3, name: "Pieter Post", matchPercentage: 72, skills: ["HTML", "Node.js"]},
        ];

        // Sort the data and then set the state
        const sortedStudents = [...studentsData].sort((a, b) => b.matchPercentage - a.matchPercentage);
        setStudents(sortedStudents);
    }, []);

    return (
        <>
            <div className="dashboard-container">
                <header className="header-row">
                    <div>
                        <h1>BEDRIJF DASHBOARD</h1>
                        <p>Techno Innovators BV</p>
                    </div>
                    <button className="btn-logout">Uitloggen</button>
                </header>

                {/* Stat Cards */}
                <div className="stats-row">
                    <div className="stat-card">
                        <h2>3</h2>
                        <p>Actieve vacatures</p>
                    </div>
                    <div className="stat-card">
                        <h2>35</h2>
                        <p>Totale vacatures</p>
                    </div>
                    <div className="stat-card">
                        <h2>23</h2>
                        <p>AI matches</p>
                    </div>
                </div>

                <button className="btn-primary">+ NIEUWE VACATURE PLAATSEN</button>

                <h2>MIJN VACATURES</h2>

                <div className="vacancy-list">

                    <div className="vacancy-item">
                        <div>
                            <h3>Frontend Developer Stagiair <span className="badge">Actief</span></h3>
                            <p>12 sollicitaties | 8 AI Matches</p>
                            <button className="btn-outline">BEKIJK KANDIDATEN</button>
                        </div>
                        <div className="actions">
                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                       width="24px" fill="#000000"><path
                                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                       width="24px" fill="#000000"><path
                                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></span>
                        </div>
                    </div>

                    <div className="vacancy-item">
                        <div>
                            <h3>UX/UI Designer Stagiair <span className="badge">Actief</span></h3>
                            <p>22 sollicitaties | 12 AI Matches</p>
                            <button className="btn-outline">BEKIJK KANDIDATEN</button>
                        </div>
                        <div className="actions">
                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                       width="24px" fill="#000000"><path
                                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                       width="24px" fill="#000000"><path
                                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></span>
                        </div>
                    </div>

                    <div className="vacancy-item">
                        <div>
                            <h3>Backend Developer Stagiair <span className="badge">Actief</span></h3>
                            <p>15 sollicitaties | 10 AI Matches</p>
                            <button className="btn-outline">BEKIJK KANDIDATEN</button>
                        </div>
                        <div className="actions">
                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                       width="24px" fill="#000000"><path
                                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                       width="24px" fill="#000000"><path
                                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></span>
                        </div>
                    </div>
                </div>

                <div className="dashboard">
                    <h1>Student Match Overview</h1>
                    <div className="student-list">
                        {students.map(student => (
                            <StudentCard key={student.id} student={student}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyDashboard;