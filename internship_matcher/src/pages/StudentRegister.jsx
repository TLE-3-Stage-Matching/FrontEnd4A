import React, {useState} from 'react';
import '../components/studentregister.css';

const RegistrationForm = () => {
    // Data keys zijn nu Engels voor de backend, UI blijft Nederlands
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        courses: [],
        skills: [],
        availability: '',
        document: null
    });

    const [inputVal, setInputVal] = useState({course: '', skill: ''});

    // Universele functie om tags toe te voegen
    const addTag = (field, type) => {
        const value = inputVal[type];
        if (value.trim() !== '') {
            setFormData({
                ...formData,
                [field]: [...formData[field], value]
            });
            setInputVal({...inputVal, [type]: ''});
        }
    };

    // Functie om tags te verwijderen
    const removeTag = (field, index) => {
        const updatedList = formData[field].filter((_, i) => i !== index);
        setFormData({...formData, [field]: updatedList});
    };

    return (
        <div className="registration-container">
            <div className="header-section">
                <h1>Het "Eerlijke Profiel"</h1>
                <p>Maak je profiel compleet voor betere matches. We gebruiken alleen relevante data.</p>
            </div>

            <div className="privacy-box">
                <div className="privacy-column">
                    <strong>Deze data gebruiken we WEL:</strong>
                    <ul>
                        <li>Skills & competenties</li>
                        <li>Opleiding & studiejaar</li>
                        <li>Beschikbaarheid</li>
                    </ul>
                </div>
                <div className="privacy-column">
                    <strong>Deze data gebruiken we NIET:</strong>
                    <ul>
                        <li>Naam of geslacht</li>
                        <li>Afkomst of etniciteit</li>
                        <li>Woonadres of postcode</li>
                        <li>Leeftijd of geboortedatum</li>
                    </ul>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group" style={{flex: 1}}>
                    <label>Voornaam*</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                </div>
                <div className="form-group" style={{flex: 1}}>
                    <label>Achternaam*</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Opleiding(en)*</label>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input
                        type="text"
                        value={inputVal.course}
                        onChange={(e) => setInputVal({...inputVal, course: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && addTag('courses', 'course')}
                    />
                    <button className="add-btn" onClick={() => addTag('courses', 'course')}>+</button>
                </div>
                <div style={{marginTop: '10px'}}>
                    {formData.courses.map((edu, i) => (
                        <div key={i} className="education-item">
                            {edu}
                            <span className="remove-x" onClick={() => removeTag('courses', i)}>✕</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Skills & Competenties*</label>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input
                        type="text"
                        value={inputVal.skill}
                        onChange={(e) => setInputVal({...inputVal, skill: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && addTag('skills', 'skill')}
                    />
                    <button className="add-btn" onClick={() => addTag('skills', 'skill')}>+</button>
                </div>
                <div className="tag-container">
                    {formData.skills.map((skill, i) => (
                        <div key={i} className="skill-tag">
                            {skill}
                            <span className="remove-x" onClick={() => removeTag('skills', i)}>✕</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Beschikbaarheid*</label>
                <input
                    type="text"
                    placeholder="Bijv. Februari 2026 - Juni 2026"
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Extra Context (Optioneel)</label>
                <p style={{fontSize: '12px', color: '#666'}}>Upload documenten zoals cijferlijsten of portfolio's voor
                    betere matching</p>
                <div className="upload-zone">
                    <input
                        type="file"
                        style={{display: 'none'}}
                        id="fileUpload"
                        onChange={(e) => setFormData({...formData, document: e.target.files[0]})}
                    />
                    <label htmlFor="fileUpload" className="upload-label">
                        <span>⬇️ Document Uploaden</span>
                        {formData.document &&
                            <p style={{fontSize: '12px', color: '#2ecc71'}}>Geselecteerd: {formData.document.name}</p>}
                    </label>
                </div>
            </div>

            <button className="submit-btn" onClick={() => console.log("Verzenden naar backend:", formData)}>
                Profiel Voltooien
            </button>
        </div>
    );
};

export default RegistrationForm;