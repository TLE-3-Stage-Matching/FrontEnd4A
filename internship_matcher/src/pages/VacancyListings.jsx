import React, {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {Link} from 'react-router-dom';
import '../components/VacancyListings.css'; // New CSS file for this page

// --- Sub-component for Match Explanation ---
const MatchExplanation = ({studentSkills, vacancySkills}) => {
    // This is a simplified matching algorithm
    const studentSkillIds = new Set(studentSkills.map(s => s.id));

    let reasons = [];

    // Check for must-have skills
    vacancySkills.filter(vs => vs.type === 'must').forEach(vs => {
        if (studentSkillIds.has(vs.id)) {
            reasons.push({text: `Skill '${vs.name}' is een match`, type: 'positive', importance: 1});
        } else {
            reasons.push({text: `Je mist de vereiste skill '${vs.name}'`, type: 'negative', importance: 10});
        }
    });

    // Check for nice-to-have skills
    vacancySkills.filter(vs => vs.type === 'nice').forEach(vs => {
        if (studentSkillIds.has(vs.id)) {
            reasons.push({text: `Bonus: je bezit de skill '${vs.name}'`, type: 'positive', importance: 0.5});
        }
    });

    // Sort reasons: negative first, then positive
    reasons.sort((a, b) => b.importance - a.importance);

    // Opmerking: Omdat de mock-data beperkt is, worden er mogelijk minder dan 3 redenen getoond.
    // In een live scenario met rijkere data zal dit vaker een top 3 zijn.
    const top3Reasons = reasons.slice(0, 3);

    return (
        <div className="match-explanation">
            <h4>Match Redenen:</h4>
            <ul>
                {top3Reasons.map((reason, index) => (
                    <li key={index} className={`reason-${reason.type}`}>
                        {reason.type === 'positive' ? '✓' : '✗'} {reason.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};


const VacancyListings = () => {
    const {vacancies, studentProfile, isLoading} = useContext(AppContext);

    if (isLoading || !studentProfile) {
        return <div className="dashboard-container"><h1>Vacatures worden geladen...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>Beschikbare Stages</h1>
                <Link to="/dashboard/student" className="btn-outline">Terug naar Dashboard</Link>
            </header>

            <div className="vacancy-listings-container">
                {vacancies.map(vacancy => (
                    <div key={vacancy.id} className="vacancy-card">
                        <h3>{vacancy.title}</h3>
                        <p>{vacancy.description}</p>
                        <MatchExplanation
                            studentSkills={studentProfile.skills}
                            vacancySkills={vacancy.skills}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VacancyListings;
