import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import '../components/studentregister.css'; // Reusing the CSS file for similar styling

const StudentOnboarding = () => {
    // --- HOOKS & CONTEXT ---
    const {tags: allAvailableTags, isLoading, syncStudentTags} = useContext(AppContext);
    const [selectedTagIds, setSelectedTagIds] = useState(new Set());
    const navigate = useNavigate();

    // --- EFFECTS ---
    useEffect(() => {
        if (!isLoading) {
            console.log('Student onboarding pagina ingeladen!');
        }
    }, [isLoading]);

    // --- HANDLERS ---
    const handleTagClick = (tagId) => {
        const newSelectedTagIds = new Set(selectedTagIds);
        if (newSelectedTagIds.has(tagId)) {
            newSelectedTagIds.delete(tagId);
        } else {
            newSelectedTagIds.add(tagId);
        }
        setSelectedTagIds(newSelectedTagIds);
        console.log(`Tag geklikt: ${tagId}. Geselecteerde tags:`, Array.from(newSelectedTagIds));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Gedrukt op: Sla vaardigheden op en ga naar Dashboard");

        const tagsPayload = Array.from(selectedTagIds).map(id => ({
            tag_id: id,
            is_active: true,
            weight: 5
        }));

        await syncStudentTags(tagsPayload);

        navigate('/dashboard/student');
    };

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <div className="registration-container"><h1>Aan het laden...</h1></div>;
    }

    const selectedTags = allAvailableTags.filter(tag => selectedTagIds.has(tag.id));
    const availableTags = allAvailableTags.filter(tag => !selectedTagIds.has(tag.id));

    return (
        <div className="registration-container">
            <div className="header-section">
                <h1>Welkom! Vul je vaardigheden aan</h1>
                <p>Selecteer de skills die bij jou passen. Dit helpt ons de beste matches te vinden.</p>
            </div>

            <div className="privacy-box">
                {/* ... privacy box content ... */}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Mijn Vaardigheden</label>
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
                    <label>Beschikbare Vaardigheden</label>
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
                    Sla vaardigheden op en ga naar Dashboard
                </button>
            </form>
        </div>
    );
};

export default StudentOnboarding;
