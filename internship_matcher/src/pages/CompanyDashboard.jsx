import React, {useState} from 'react';
import '../components/companydashboard.css';

const CompanyDashboard = ({onViewChange}) => {
    // State om te wisselen tussen dashboard en vacature aanmaken
    const [view, setView] = useState('dashboard');

    // State voor het vacature formulier
    const [vacancyForm, setVacancyForm] = useState({
        title: '',
        description: '',
        skillInput: '',
        skills: [] // Hier slaan we de skills + prioriteit op
    });

    // Mock data voor het dashboard
    const stats = [
        {label: 'Active vacatures', value: 3},
        {label: 'Totale vacatures', value: 35},
        {label: 'AI matches', value: 23},
    ];

    const vacancies = [
        {title: 'Frontend Developer Stagiair', applications: 12, matches: 8},
        {title: 'UX/UI Design Stage', applications: 5, matches: 5},
        {title: 'Backend Developer Stage', applications: 2, matches: 1},
    ];

    // --- LOGICA VOOR TICKET #7 ---

    // Skill toevoegen aan de lijst
    const handleAddSkill = (e) => {
        e.preventDefault();
        if (vacancyForm.skillInput.trim()) {
            setVacancyForm({
                ...vacancyForm,
                skills: [
                    ...vacancyForm.skills,
                    {name: vacancyForm.skillInput, type: 'must'} // Standaard is 'Must-have'
                ],
                skillInput: ''
            });
        }
    };

    // Type wijzigen (Must-have <-> Nice-to-have)
    const handleSkillTypeChange = (index, newType) => {
        const updatedSkills = vacancyForm.skills.map((skill, i) => {
            if (i === index) return {...skill, type: newType};
            return skill;
        });
        setVacancyForm({...vacancyForm, skills: updatedSkills});
    };

    // Skill verwijderen
    const handleRemoveSkill = (index) => {
        const updatedSkills = vacancyForm.skills.filter((_, i) => i !== index);
        setVacancyForm({...vacancyForm, skills: updatedSkills});
    };

    const handleSubmit = () => {
        console.log("Vacature opgeslagen met skills:", vacancyForm);
        // Hier zou de API call komen
        setView('dashboard');
    };

    // --- RENDER ---

    if (view === 'create') {
        return (
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>Nieuwe Vacature</h1>
                    <button onClick={() => setView('dashboard')} className="btn btn-secondary">
                        Terug naar overzicht
                    </button>
                </header>

                <div className="form-container" style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                }}>
                    <div style={{marginBottom: '1rem'}}>
                        <label
                            style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>Functietitel</label>
                        <input
                            type="text"
                            value={vacancyForm.title}
                            onChange={(e) => setVacancyForm({...vacancyForm, title: e.target.value})}
                            style={{width: '100%', padding: '0.5rem'}}
                            placeholder="Bijv. React Developer"
                        />
                    </div>

                    <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem'}}>Benodigde
                            Skills</label>
                        <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                            <input
                                type="text"
                                value={vacancyForm.skillInput}
                                onChange={(e) => setVacancyForm({...vacancyForm, skillInput: e.target.value})}
                                placeholder="Voeg een skill toe (bijv. JavaScript)"
                                style={{flex: 1, padding: '0.5rem'}}
                            />
                            <button onClick={handleAddSkill} className="btn btn-primary"
                                    style={{padding: '0.5rem 1rem'}}>+
                            </button>
                        </div>

                        {/* HIER ZIT DE FUNCTIONALITEIT VOOR TICKET #7 */}
                        <div className="skills-list">
                            {vacancyForm.skills.map((skill, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#f9f9f9',
                                    padding: '10px',
                                    marginBottom: '8px',
                                    borderLeft: skill.type === 'must' ? '4px solid #d32f2f' : '4px solid #2ecc71',
                                    borderRadius: '4px'
                                }}>
                                    <span style={{fontWeight: '500'}}>{skill.name}</span>

                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                        {/* De Dropdown/Toggle */}
                                        <select
                                            value={skill.type}
                                            onChange={(e) => handleSkillTypeChange(index, e.target.value)}
                                            style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
                                        >
                                            <option value="must">Must-have 🔥</option>
                                            <option value="nice">Nice-to-have 👍</option>
                                        </select>

                                        <button
                                            onClick={() => handleRemoveSkill(index)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#999'
                                            }}
                                        >✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="btn btn-primary"
                            style={{width: '100%', marginTop: '1rem'}}>
                        Vacature Publiceren
                    </button>
                </div>
            </div>
        );
    }

    // Het bestaande dashboard view
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Company Dashboard</h1>
                <button onClick={() => setView('create')} className="btn btn-primary">
                    Nieuwe vacature plaatsen
                </button>
            </header>

            <section className="stats-container">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                    </div>
                ))}
            </section>

            <section className="vacancies-section">
                <h2>Mijn Vacatures</h2>
                <ul className="vacancy-list">
                    {vacancies.map((vacancy, index) => (
                        <li key={index} className="vacancy-item">
                            <div className="vacancy-info">
                                <h3>{vacancy.title}</h3>
                                <div className="vacancy-meta">
                                    <span>{vacancy.applications} Sollicitaties</span>
                                    <span>{vacancy.matches} AI Matches</span>
                                </div>
                            </div>
                            <button className="btn btn-secondary">Bekijk Details</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default CompanyDashboard;