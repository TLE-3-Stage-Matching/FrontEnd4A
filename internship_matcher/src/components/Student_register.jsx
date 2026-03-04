import React, {useState} from 'react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        voornaam: '',
        achternaam: '',
        opleidingen: [],
        skills: [],
        beschikbaarheid: '',
        foto: null
    });

    const [inputVal, setInputVal] = useState({opleiding: '', skill: ''});

    const handleAddTag = (e, field) => {
        if (e.key === 'Enter' && inputVal[field].trim() !== '') {
            e.preventDefault();
            setFormData({
                ...formData,
                [field === 'opleiding' ? 'opleidingen' : 'skills']: [
                    ...formData[field === 'opleiding' ? 'opleidingen' : 'skills'],
                    inputVal[field]
                ]
            });
            setInputVal({...inputVal, [field]: ''});
        }
    };

    const removeTag = (field, index) => {
        const updatedList = formData[field].filter((_, i) => i !== index);
        setFormData({...formData, [field]: updatedList});
    };

    return (
        <div style={{maxWidth: '500px', margin: 'auto', padding: '20px', fontFamily: 'Arial'}}>
            <h2>Registratie</h2>

            {/* Voornaam & Achternaam */}
            <div style={{marginBottom: '15px'}}>
                <input
                    type="text"
                    placeholder="Voornaam"
                    onChange={(e) => setFormData({...formData, voornaam: e.target.value})}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Achternaam"
                    onChange={(e) => setFormData({...formData, achternaam: e.target.value})}
                    style={inputStyle}
                />
            </div>

            {/* Opleidingen Tags */}
            <div style={{marginBottom: '15px'}}>
                <label>Opleidingen (Druk op Enter)</label>
                <div style={tagContainerStyle}>
                    {formData.opleidingen.map((item, i) => (
                        <span key={i} style={tagStyle}>{item} <b onClick={() => removeTag('opleidingen', i)}
                                                                 style={{cursor: 'pointer'}}>x</b></span>
                    ))}
                </div>
                <input
                    type="text"
                    value={inputVal.opleiding}
                    onChange={(e) => setInputVal({...inputVal, opleiding: e.target.value})}
                    onKeyDown={(e) => handleAddTag(e, 'opleiding')}
                    style={inputStyle}
                />
            </div>

            {/* Skills & Competenties Tags */}
            <div style={{marginBottom: '15px'}}>
                <label>Skills & Competenties (Druk op Enter)</label>
                <div style={tagContainerStyle}>
                    {formData.skills.map((item, i) => (
                        <span key={i} style={tagStyle}>{item} <b onClick={() => removeTag('skills', i)}
                                                                 style={{cursor: 'pointer'}}>x</b></span>
                    ))}
                </div>
                <input
                    type="text"
                    value={inputVal.skill}
                    onChange={(e) => setInputVal({...inputVal, skill: e.target.value})}
                    onKeyDown={(e) => handleAddTag(e, 'skill')}
                    style={inputStyle}
                />
            </div>

            {/* Beschikbaarheid */}
            <div style={{marginBottom: '15px'}}>
                <label>Beschikbaarheid</label>
                <select
                    onChange={(e) => setFormData({...formData, beschikbaarheid: e.target.value})}
                    style={inputStyle}
                >
                    <option value="">Maak een keuze</option>
                    <option value="fulltime">Fulltime</option>
                    <option value="parttime">Parttime</option>
                    <option value="freelance">Freelance</option>
                </select>
            </div>

            {/* Foto Upload */}
            <div style={{marginBottom: '15px'}}>
                <label>Profielfoto</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, foto: e.target.files[0]})}
                    style={inputStyle}
                />
            </div>

            <button style={buttonStyle} onClick={() => console.log(formData)}>Registreren</button>
        </div>
    );
};
export default RegistrationForm;