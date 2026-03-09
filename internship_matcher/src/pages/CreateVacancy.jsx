// It's giving main character energy, now with Edit Mode, Accessibility & Logging.
import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/CreateVacancy.css';

// An ACCESSIBLE toggle component. We love an inclusive queen.
const SkillToggle = ({type, onToggle}) => (
    <button
        type="button"
        role="switch"
        aria-checked={type === 'nice'}
        onClick={onToggle}
        className="toggle-container"
    >
        <span className={`toggle-label ${type === 'must' ? 'active' : ''}`} aria-hidden="true">Must</span>
        <div className={`toggle-switch ${type === 'nice' ? 'toggled' : ''}`}>
            <div className="toggle-handle"></div>
        </div>
        <span className={`toggle-label ${type === 'nice' ? 'active' : ''}`} aria-hidden="true">Nice</span>
    </button>
);

const CreateVacancy = () => {
    // --- HOOKS & CONTEXT ---
    const {vacancies, addVacancy, updateVacancy} = useContext(AppContext);
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditMode = Boolean(id);

    // --- STATE ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');
    const [nextSkillId, setNextSkillId] = useState(1);

    // --- EFFECTS ---
    useEffect(() => {
        if (isEditMode) {
            console.log(`Vacature bewerken pagina ingeladen voor vacature ID: ${id}!`);
            const vacancyToEdit = vacancies.find(v => v.id === parseInt(id));
            if (vacancyToEdit) {
                setTitle(vacancyToEdit.title);
                setDescription(vacancyToEdit.description || '');
                setSkills(vacancyToEdit.skills || []);
                const maxId = vacancyToEdit.skills.reduce((max, s) => s.id > max ? s.id : max, 0);
                setNextSkillId(maxId + 1);
            }
        } else {
            console.log('Nieuwe vacature pagina ingeladen!');
        }
    }, [id, isEditMode, vacancies]);

    // --- HANDLERS ---
    const handleAddSkill = () => {
        if (!currentSkill.trim() || skills.some(s => s.name.toLowerCase() === currentSkill.trim().toLowerCase())) {
            setCurrentSkill('');
            return;
        }
        console.log(`Gedrukt op: Voeg skill toe: "${currentSkill.trim()}"`);
        const newSkill = {id: nextSkillId, name: currentSkill.trim(), type: 'must'};
        setSkills([...skills, newSkill]);
        setNextSkillId(nextSkillId + 1);
        setCurrentSkill('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (idToRemove, skillName) => {
        console.log(`Gedrukt op: Verwijder skill "${skillName}"`);
        setSkills(skills.filter(skill => skill.id !== idToRemove));
    };

    const handleToggleSkillType = (idToToggle, skillName) => {
        const skill = skills.find(s => s.id === idToToggle);
        if (skill) {
            const newType = skill.type === 'must' ? 'nice' : 'must';
            console.log(`Gedrukt op: Toggle skill "${skillName}" naar "${newType}"`);
            setSkills(skills.map(s => s.id === idToToggle ? {...s, type: newType} : s));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Gedrukt op: Formulier opslaan/plaatsen');
        const vacancyData = {title, description, skills};
        if (isEditMode) {
            updateVacancy({...vacancyData, id: parseInt(id)});
        } else {
            addVacancy(vacancyData);
        }
        navigate('/dashboard/bedrijf');
    };

    // --- RENDER ---
    const renderSkillList = (type) => {
        return skills
            .filter(skill => skill.type === type)
            .map(skill => (
                <li key={skill.id} className="skill-pill">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-controls">
                        <SkillToggle type={skill.type} onToggle={() => handleToggleSkillType(skill.id, skill.name)}/>
                        <button onClick={() => handleRemoveSkill(skill.id, skill.name)} className="remove-skill-btn"
                                aria-label={`Remove ${skill.name}`}>&times;</button>
                    </div>
                </li>
            ));
    };

    return (
        <div className="create-vacancy-container">
            <div className="vacancy-form-header">
                <button onClick={() => {
                    console.log('Gedrukt op: Terug naar dashboard');
                    navigate('/dashboard/bedrijf');
                }} className="btn-link back-to-dash-btn">
                    &larr; Terug naar dashboard
                </button>
                <h1>{isEditMode ? 'Vacature Bewerken' : 'Nieuwe Vacature'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Basisinformatie</h2>
                    <div className="form-group">
                        <label htmlFor="vacancy-title">Titel</label>
                        <input id="vacancy-title" type="text" value={title} onChange={(e) => {
                            console.log(`Input 'Titel' veranderd naar: "${e.target.value}"`);
                            setTitle(e.target.value);
                        }} placeholder="e.g., Frontend Developer Stagiair" required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="vacancy-description">Beschrijving</label>
                        <textarea id="vacancy-description" value={description} onChange={(e) => {
                            console.log(`Input 'Beschrijving' veranderd`);
                            setDescription(e.target.value);
                        }} placeholder="Vertel over de rol, de taken, het team..."></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Vereiste Vaardigheden</h2>
                    <div className="form-group">
                        <label htmlFor="new-skill-input">Nieuwe skill toevoegen</label>
                        <div className="skills-input-container">
                            <input id="new-skill-input" type="text" value={currentSkill} onChange={(e) => {
                                console.log(`Input 'Nieuwe skill' veranderd naar: "${e.target.value}"`);
                                setCurrentSkill(e.target.value);
                            }} onKeyPress={handleKeyPress} placeholder="e.g., TypeScript"/>
                            <button type="button" onClick={handleAddSkill}
                                    className="btn btn-secondary add-skill-btn">Voeg toe
                            </button>
                        </div>
                    </div>
                    <div className="skills-list-container">
                        <div className="skills-list">
                            <h3>Must-have</h3>
                            <ul className="skills-pills">{renderSkillList('must')}</ul>
                        </div>
                        <div className="skills-list">
                            <h3>Nice-to-have</h3>
                            <ul className="skills-pills">{renderSkillList('nice')}</ul>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                    {isEditMode ? 'Wijzigingen Opslaan' : 'Vacature Plaatsen'}
                </button>
            </form>
        </div>
    );
};

export default CreateVacancy;
