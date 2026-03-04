import React from 'react';
import './company.css';


const StudentCard = ({student}) => {
    return (
        <div className="card">
            <div className="card-info">
                <h3>{student.name}</h3>
                <p>Skills: {student.skills.join(', ')}</p>
            </div>
            <div className="match-badge">
                <strong>{student.matchPercentage}% Match</strong>
            </div>
        </div>
    );
};

export default StudentCard;