// It's giving main character energy, now with Edit Mode.
import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/CreateVacancy.css'; // Assuming this CSS file still exists and is relevant

// A cute little toggle component. It knows its job. It's giving "switch realness".
const SkillToggle = ({type, onToggle}) => (
    <div className="toggle-container" onClick={onToggle}>
        <div className={`toggle-label ${type === 'must' ? 'active' : ''}`}>Must</div>
        <div className={`toggle-switch ${type === 'nice' ? 'toggled' : ''}`}>
            <div className="toggle-handle"></div>
        </div>
        <div className={`toggle-label ${type === 'nice' ? 'active' : ''}`}>Nice</div>
    </div>
);

const CreateVacancy = () => {
    // --- HOOKS & CONTEXT ---
    const {vacancies, addVacancy, updateVacancy} = useContext(AppContext);
    const navigate = useNavigate();
    const {id} = useParams(); // Gets the ':id' from the URL.

    const isEditMode = Boolean(id);

    // --- STATE MANAGEMENT ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');
    const [nextSkillId, setNextSkillId] = useState(1);

    // --- EFFECTS ---
    // This useEffect is the stylist. It dresses the component for its role: create or edit.
    useEffect(() => {
        if (isEditMode) {
            const vacancyToEdit = vacancies.find(v => v.id === parseInt(id));
            if (vacancyToEdit) {
                // Pre-fill the form with the data of the vacancy to be edited.
                setTitle(vacancyToEdit.title);
                setDescription(vacancyToEdit.description || '');
                setSkills(vacancyToEdit.skills || []);
                // Ensure nextSkillId is higher than any existing skill id
                const maxId = vacancyToEdit.skills.reduce((max, s) => s.id > max ? s.id : max, 0);
                setNextSkillId(maxId + 1);
            }
        }
        // If not in edit mode, the default empty state is already set.
    }, [id, isEditMode, vacancies]);


    // --- HANDLERS ---
    const handleAddSkill = () => {
        if (!currentSkill.trim() || skills.some(s => s.name.toLowerCase() === currentSkill.trim().toLowerCase())) {
            setCurrentSkill('');
            return;
        }
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

    const handleRemoveSkill = (idToRemove) => {
        setSkills(skills.filter(skill => skill.id !== idToRemove));
    };

    const handleToggleSkillType = (idToToggle) => {
        setSkills(skills.map(skill =>
            skill.id === idToToggle
                ? {...skill, type: skill.type === 'must' ? 'nice' : 'must'}
                : skill
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const vacancyData = {title, description, skills};
        if (isEditMode) {
            updateVacancy({...vacancyData, id: parseInt(id)});
        } else {
            addVacancy(vacancyData);
        }
        // After submit, navigate back to the dashboard. And... scene.
        navigate('/dashboard/bedrijf');
    };

    const renderSkillList = (type) => {
        return skills
            .filter(skill => skill.type === type)
            .map(skill => (
                <li key={skill.id} className="skill-pill">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-controls">
                        <SkillToggle type={skill.type} onToggle={() => handleToggleSkillType(skill.id)}/>
                        <button onClick={() => handleRemoveSkill(skill.id)}
                                className="remove-skill-btn">&times;</button>
                    </div>
                </li>
            ));
    };

    // --- RENDER ---
    return (
        <div className="create-vacancy-container">
            <div className="vacancy-form-header">
                <button onClick={() => navigate('/companydashboard')} className="btn-link back-to-dash-btn">
                    &larr; Terug naar dashboard
                </button>
                <h1>{isEditMode ? 'Vacature Bewerken' : 'Nieuwe Vacature'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Basisinformatie</h2>
                    <div className="form-group">
                        <label>Titel</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                               placeholder="e.g., Frontend Developer Stagiair" required/>
                    </div>
                    <div className="form-group">
                        <label>Beschrijving</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Vertel over de rol, de taken, het team..."></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Vereiste Vaardigheden</h2>
                    <div className="form-group">
                        <label>Nieuwe skill toevoegen</label>
                        <div className="skills-input-container">
                            <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)}
                                   onKeyPress={handleKeyPress} placeholder="e.g., TypeScript"/>
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
