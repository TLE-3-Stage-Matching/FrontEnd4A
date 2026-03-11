import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/studentregister.css'; // Reusing the CSS file for similar styling

const StudentOnboarding = () => {
    // --- HOOKS & CONTEXT ---
    const {tags: allAvailableTags, studentProfile, isLoading, syncStudentTags} = useContext(AppContext);
    const [selectedTagIds, setSelectedTagIds] = useState(new Set());
    const navigate = useNavigate();

    // --- EFFECTS ---
    // Pre-populate selected skills when the component loads or studentProfile changes
    useEffect(() => {
        if (studentProfile && studentProfile.student_tags) {
            const initialIds = studentProfile.student_tags.map(tagInfo => tagInfo.tag.id);
            setSelectedTagIds(new Set(initialIds));
            console.log('Onboarding pagina: bestaande skills ingeladen.', initialIds);
        }
    }, [studentProfile]);

    // --- HANDLERS ---
    const handleTagClick = (tagId) => {
        const newSelectedTagIds = new Set(selectedTagIds);
        if (newSelectedTagIds.has(tagId)) {
            newSelectedTagIds.delete(tagId);
        } else {
            newSelectedTagIds.add(tagId);
        }
        setSelectedTagIds(newSelectedTagIds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Gedrukt op: Sla vaardigheden op");

        const tagsPayload = Array.from(selectedTagIds).map(id => ({
            tag_id: id,
            is_active: true, // Assuming active when selected
            weight: 5 // Default weight
        }));

        await syncStudentTags(tagsPayload);

        // Always navigate back to the dashboard after saving
        navigate('/dashboard/student');
    };

    // --- RENDER LOGIC ---
    if (isLoading || !allAvailableTags) {
        return <div className="registration-container"><h1>Vaardigheden worden geladen...</h1></div>;
    }

    const selectedTags = allAvailableTags.filter(tag => selectedTagIds.has(tag.id));
    const availableTags = allAvailableTags.filter(tag => !selectedTagIds.has(tag.id));

    return (
        <div className="registration-container">
            <div className="header-section">
                <h1>Mijn Vaardigheden</h1>
                <p>Selecteer de skills die bij jou passen. Dit helpt ons de beste matches te vinden.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Mijn Geselecteerde Skills</label>
                    <div className="tag-container selected-tags">
                        {selectedTags.length > 0 ? selectedTags.map(tag => (
                            <div key={tag.id} className="skill-tag" onClick={() => handleTagClick(tag.id)}>
                                {tag.name}
                                <span className="remove-x">✕</span>
                            </div>
                        )) : <p className="placeholder-text">Selecteer skills uit de lijst hieronder.</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Beschikbare Skills</label>
                    <div className="tag-container">
                        {availableTags.map(tag => (
                            <div key={tag.id} className="skill-tag available-tag"
                                 onClick={() => handleTagClick(tag.id)}>
                                {tag.name}
                                <span className="add-plus">+</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Sla Vaardigheden Op
                </button>
            </form>
        </div>
    );
};

export default StudentOnboarding;
