import React, {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/CreateVacancy.css';

// ... (SkillToggle component remains the same)
const SkillToggle = ({type, onToggle}) => (
    <button type="button" role="switch" aria-checked={type === 'nice'} onClick={onToggle} className="toggle-container">
        <span className={`toggle-label ${type === 'must' ? 'active' : ''}`} aria-hidden="true">Must</span>
        <div className={`toggle-switch ${type === 'nice' ? 'toggled' : ''}`}>
            <div className="toggle-handle"></div>
        </div>
        <span className={`toggle-label ${type === 'nice' ? 'active' : ''}`} aria-hidden="true">Nice</span>
    </button>
);


const CreateVacancy = () => {
    // --- HOOKS & CONTEXT ---
    const {vacancies, tags: availableTags, isLoading, addVacancy, updateVacancy} = useContext(AppContext);
    const navigate = useNavigate();
    const {id} = useParams();
    const isEditMode = Boolean(id);

    // --- STATE ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState([]); // This will hold objects like {id?, name, type}
    const [currentSkill, setCurrentSkill] = useState('');

    // --- EFFECTS ---
    useEffect(() => {
        if (!isLoading && isEditMode) {
            console.log(`Vacature bewerken pagina ingeladen voor vacature ID: ${id}!`);
            const vacancyToEdit = vacancies.find(v => v.id === parseInt(id));
            if (vacancyToEdit) {
                setTitle(vacancyToEdit.title);
                setDescription(vacancyToEdit.description || '');
                // The local skills state should be compatible with the API structure
                setSkills(vacancyToEdit.skills || []); 
            }
        } else if (!isLoading) {
            console.log('Nieuwe vacature pagina ingeladen!');
        }
    }, [id, isEditMode, vacancies, isLoading]);

    // --- HANDLERS ---
    const handleAddSkill = () => {
        const skillName = currentSkill.trim();
        if (!skillName || skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
            setCurrentSkill('');
            return;
        }
        console.log(`Gedrukt op: Voeg skill toe: "${skillName}"`);

        // Check if the skill exists in the available tags from the API
        const existingTag = availableTags.find(tag => tag.name.toLowerCase() === skillName.toLowerCase());

        let newSkill;
        if (existingTag) {
            // It's a known tag, add it with its ID
            newSkill = {id: existingTag.id, name: existingTag.name, type: 'must'};
        } else {
            // It's a new tag, add it by name only
            newSkill = {name: skillName, type: 'must'};
        }
        
        setSkills([...skills, newSkill]);
        setCurrentSkill('');
    };

    const handleRemoveSkill = (skillNameToRemove) => {
        console.log(`Gedrukt op: Verwijder skill "${skillNameToRemove}"`);
        setSkills(skills.filter(skill => skill.name !== skillNameToRemove));
    };

    const handleToggleSkillType = (skillNameToToggle) => {
        const skill = skills.find(s => s.name === skillNameToToggle);
        if (skill) {
            const newType = skill.type === 'must' ? 'nice' : 'must';
            console.log(`Gedrukt op: Toggle skill "${skillNameToToggle}" naar "${newType}"`);
            setSkills(skills.map(s => s.name === skillNameToToggle ? {...s, type: newType} : s));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Gedrukt op: Formulier opslaan/plaatsen');

        // Transform local skills state into the format the API expects
        const apiTags = skills.map(skill => {
            const tagPayload = {};
            if (skill.id) {
                tagPayload.id = skill.id;
            } else {
                tagPayload.name = skill.name;
                tagPayload.tag_type = 'skill'; // default new tags to 'skill'
            }
            // Map our 'must'/'nice' to a numerical importance or another API field
            // The API doc mentions 'importance', let's use that. 1 for must, 0 for nice.
            tagPayload.importance = skill.type === 'must' ? 1 : 0;
            return tagPayload;
        });

        const vacancyData = {title, description, tags: apiTags};
        
        if (isEditMode) {
            await updateVacancy({...vacancyData, id: parseInt(id)});
        } else {
            await addVacancy(vacancyData);
        }
    };

    if (isLoading) {
        return <div className="dashboard-container"><h1>Aan het laden...</h1></div>;
    }

    // --- RENDER ---
    const renderSkillList = (type) => {
        return skills
            .filter(skill => skill.type === type)
            .map(skill => (
                <li key={skill.name} className="skill-pill">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-controls">
                        <SkillToggle type={skill.type} onToggle={() => handleToggleSkillType(skill.name)}/>
                        <button onClick={() => handleRemoveSkill(skill.name)} className="remove-skill-btn"
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
                }} className="btn-link back-to-dash-btn">&larr; Terug naar dashboard
                </button>
                <h1>{isEditMode ? 'Vacature Bewerken' : 'Nieuwe Vacature'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Basisinformatie</h2>
                    <div className="form-group">
                        <label htmlFor="vacancy-title">Titel</label>
                        <input id="vacancy-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                               required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="vacancy-description">Beschrijving</label>
                        <textarea id="vacancy-description" value={description}
                                  onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Vereiste Vaardigheden</h2>
                    <div className="form-group">
                        <label htmlFor="new-skill-input">Nieuwe skill toevoegen</label>
                        <div className="skills-input-container">
                            <input id="new-skill-input" type="text" list="available-tags" value={currentSkill}
                                   onChange={(e) => setCurrentSkill(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}/>
                            <datalist id="available-tags">
                                {availableTags.map(tag => <option key={tag.id} value={tag.name}/>)}
                            </datalist>
                            <button type="button" onClick={handleAddSkill}
                                    className="btn btn-secondary add-skill-btn">Voeg toe
                            </button>
                        </div>
                    </div>
                    <div className="skills-list-container">
                        <div className="skills-list"><h3>Must-have</h3>
                            <ul className="skills-pills">{renderSkillList('must')}</ul>
                        </div>
                        <div className="skills-list"><h3>Nice-to-have</h3>
                            <ul className="skills-pills">{renderSkillList('nice')}</ul>
                        </div>
                    </div>
                </div>

                <button type="submit"
                        className="btn btn-primary submit-btn">{isEditMode ? 'Wijzigingen Opslaan' : 'Vacature Plaatsen'}</button>
            </form>
        </div>
    );
};

export default CreateVacancy;
