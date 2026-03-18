import React, {useContext, useState} from 'react';
import {AppContext} from '../context/AppContext';

const LearningGoals = () => {
    // 1. Pull the removeLearningGoal function from context
    const {learningGoals, removeLearningGoal} = useContext(AppContext);
    const [expandedVacancyId, setExpandedVacancyId] = useState(null);

    return (
        <div style={{padding: '40px', maxWidth: '800px', margin: '0 auto'}}>
            <h2>Mijn Leerdoelen</h2>
            <p>Skills die je nog wilt ontwikkelen voor je favoriete stages.</p>

            {learningGoals.length === 0 ? (
                <div style={{padding: '20px', backgroundColor: '#fff', borderRadius: '8px'}}>
                    Je hebt nog geen leerdoelen opgeslagen. Ga naar de Wat-als Simulator!
                </div>
            ) : (
                learningGoals.map((goal) => {
                    const isExpanded = expandedVacancyId === goal.vacancy.id;

                    return (
                        <div key={goal.vacancy.id} style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            padding: '20px',
                            border: '1px solid #ddd'
                        }}>
                            <div
                                style={{display: 'flex', justifyContent: 'space-between', cursor: 'pointer'}}
                                onClick={() => setExpandedVacancyId(isExpanded ? null : goal.vacancy.id)}
                            >
                                <div>
                                    <h3 style={{margin: '0 0 5px 0'}}>{goal.vacancy.title}</h3>
                                    <span style={{color: '#666', fontSize: '14px'}}>{goal.vacancy.company.name}</span>
                                </div>
                                <div style={{color: '#9A5B86', fontWeight: 'bold'}}>
                                    {isExpanded ? '▲ Inklappen' : '▼ Bekijk Skills'}
                                </div>
                            </div>

                            {/* Show the skills only when clicked */}
                            {isExpanded && (
                                <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee'}}>
                                    <h4 style={{margin: '0 0 10px 0', fontSize: '14px'}}>Doelstellingen:</h4>
                                    <ul style={{margin: 0, paddingLeft: '0', listStyle: 'none'}}>
                                        {goal.skills.map(skill => (
                                            <li key={skill.id} style={{
                                                marginBottom: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: '#f9f9f9',
                                                padding: '8px 12px',
                                                borderRadius: '4px'
                                            }}>
                                                <strong>{skill.name}</strong>

                                                {/* 2. THE DELETE BUTTON */}
                                                <button
                                                    onClick={() => removeLearningGoal(goal.vacancy.id, skill.id)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: '1px solid #C50F47', // Brand Red
                                                        color: '#C50F47',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Verwijder
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default LearningGoals;