import React, {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {Link} from 'react-router-dom';
import '../components/VacancyListings.css';
import Sandbox from "./Sandbox.jsx";
import sandbox from "./Sandbox.jsx";

// --- Sub-component for Match Explanation ---
// This component is now more robust to handle the live API data structure.
const MatchExplanation = ({studentSkills = [], vacancySkills = []}) => {
    // studentSkills is an array of { tag: { id: ... } }
    // vacancySkills is an array of { importance: ..., tag: { id: ..., name: ... } }
    const studentSkillIds = new Set((studentSkills || []).map(s => s.tag.id));

    let reasons = [];

    (vacancySkills || []).forEach(req => {
        const isMustHave = req.importance === 1;
        const hasSkill = studentSkillIds.has(req.tag.id);

        if (isMustHave) {
            if (hasSkill) {
                reasons.push({text: `Skill '${req.tag.name}' is een match`, type: 'positive', importance: 1});
            } else {
                reasons.push({text: `Je mist de vereiste skill '${req.tag.name}'`, type: 'negative', importance: 10});
            }
        } else { // Nice-to-have
            if (hasSkill) {
                reasons.push({text: `Bonus: je bezit de skill '${req.tag.name}'`, type: 'positive', importance: 0.5});
            }
        }
    });

    reasons.sort((a, b) => b.importance - a.importance);
    const top3Reasons = reasons.slice(0, 3);

    return (
        <div className="match-explanation">
            <h4>Match Redenen:</h4>
            {top3Reasons.length > 0 ? (
                <ul>
                    {top3Reasons.map((reason, index) => (
                        <li key={index} className={`reason-${reason.type}`}>
                            {reason.type === 'positive' ? '✓' : '✗'} {reason.text}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Er zijn geen specifieke skill-vereisten voor deze vacature.</p>
            )}
        </div>
    );
};

const VacancyListings = () => {
    const {vacancies, studentProfile, isLoading} = useContext(AppContext);

    // The guard now correctly prevents rendering until all data is available.
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
                {(vacancies || []).map(vacancy => {
                    // Diagnostic log to inspect the received data
                    console.log('Vacancy object received from API:', vacancy);

                    return (
                        <div key={vacancy.id} className="vacancy-card">
                            <h3>{vacancy.title}</h3>
                            <p>{vacancy.description}</p>
                            <MatchExplanation
                                studentSkills={studentProfile.student_tags}
                                vacancySkills={vacancy.vacancy_requirements}
                            />
                            <Link to={`/vacancies/${vacancy.id}`} className="btn-primary">Bekijk Details</Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VacancyListings;
