// Of course we need React, useState, and useEffect. The holy trinity of state management.
import React, {useState, useEffect} from "react";
// Serving looks with our custom CSS.
import "../components/CreateVacancy.css";

// A cute little toggle component. It knows its job. It's giving "switch realness".
const SkillToggle = ({type, onToggle}) => (
    <div className="toggle-container" onClick={onToggle}>
        <div className={`toggle-label ${type === "must" ? "active" : ""}`}>
            Must
        </div>
        <div className={`toggle-switch ${type === "nice" ? "toggled" : ""}`}>
            <div className="toggle-handle"></div>
        </div>
        <div className={`toggle-label ${type === "nice" ? "active" : ""}`}>
            Nice
        </div>
    </div>
);

// Here she is, the main character: CreateVacancy component.
const CreateVacancy = ({onViewChange}) => {
    // --- STATE MANAGEMENT SECTION ---
    // Serving state realness. We're keeping the receipts on all form data.
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Refactored state for skills. One source of truth, because we don't like drama.
    const [skills, setSkills] = useState([
        {id: 1, name: "React", type: "must"},
        {id: 2, name: "JavaScript", type: "must"},
        {id: 3, name: "Figma", type: "nice"},
        {id: 4, name: "Node.js", type: "nice"},
    ]);
    const [currentSkill, setCurrentSkill] = useState("");
    const [nextSkillId, setNextSkillId] = useState(5);

    // Sliders state. It's a balancing act, literally.
    const [skillMatch, setSkillMatch] = useState(50);
    const [experience, setExperience] = useState(30);
    const [motivation, setMotivation] = useState(20);
    const [lastChanged, setLastChanged] = useState(null);

    // --- LOGIC AND EFFECTS ---
    // This useEffect is the fairy godmother of our sliders, ensuring they always sum to 100. Bibbidi-bobbidi-boo!
    useEffect(() => {
        const total = skillMatch + experience + motivation;
        if (total !== 100) {
            const diff = 100 - total;
            if (lastChanged === "skillMatch") {
                const newExperience = Math.max(0, experience - Math.round(diff / 2));
                const newMotivation = 100 - skillMatch - newExperience;
                setExperience(newExperience);
                setMotivation(newMotivation);
            } else if (lastChanged === "experience") {
                const newSkillMatch = Math.max(0, skillMatch - Math.round(diff / 2));
                const newMotivation = 100 - experience - newSkillMatch;
                setSkillMatch(newSkillMatch);
                setMotivation(newMotivation);
            } else if (lastChanged === "motivation") {
                const newSkillMatch = Math.max(0, skillMatch - Math.round(diff / 2));
                const newExperience = 100 - motivation - newSkillMatch;
                setSkillMatch(newSkillMatch);
                setExperience(newExperience);
            }
        }
    }, [skillMatch, experience, motivation, lastChanged]);

    // Adding skills? Groundbreaking. Defaults to 'must', because we have high standards.
    const handleAddSkill = () => {
        if (
            !currentSkill.trim() ||
            skills.some(
                (s) => s.name.toLowerCase() === currentSkill.trim().toLowerCase(),
            )
        ) {
            setCurrentSkill("");
            return; // No empty or duplicate skills. Not on my watch.
        }
        const newSkill = {
            id: nextSkillId,
            name: currentSkill.trim(),
            type: "must",
        };
        setSkills([...skills, newSkill]);
        setNextSkillId(nextSkillId + 1);
        setCurrentSkill(""); // Clear the input, she's fresh.
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Stop the form from submitting
            handleAddSkill();
        }
    };

    // Removing skills because sometimes you just have to say "thank you, next."
    const handleRemoveSkill = (idToRemove) => {
        setSkills(skills.filter((skill) => skill.id !== idToRemove));
    };

    // Toggling is the new black.
    const handleToggleSkillType = (idToToggle) => {
        setSkills(
            skills.map((skill) =>
                skill.id === idToToggle
                    ? {...skill, type: skill.type === "must" ? "nice" : "must"}
                    : skill,
            ),
        );
    };

    const handleSliderChange = (setter, value, name) => {
        setter(Number(value));
        setLastChanged(name);
    };

    // A little utility to render the list of skills. Keep it DRY, darling.
    const renderSkillList = (type) => {
        return skills
            .filter((skill) => skill.type === type)
            .map((skill) => (
                <li key={skill.id} className="skill-pill">
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-controls">
                        <SkillToggle
                            type={skill.type}
                            onToggle={() => handleToggleSkillType(skill.id)}
                        />
                        <button
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="remove-skill-btn"
                        >
                            &times;
                        </button>
                    </div>
                </li>
            ));
    };

    // --- RENDER METHOD ---
    // Time to slay the DOM.
    return (
        <div className="create-vacancy-container">
            <div className="vacancy-form-header">
                <button
                    onClick={() => onViewChange("dashboard")}
                    className="btn-link back-to-dash-btn"
                >
                    &larr; Terug naar dashboard
                </button>
                <h1>Nieuwe vacature</h1>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-section">
                    <h2>Basisinformatie</h2>
                    {/* Form fields... */}
                </div>

                <div className="form-section">
                    <h2>Vereiste Vaardigheden</h2>
                    <div className="form-group">
                        <label>Nieuwe skill toevoegen</label>
                        <div className="skills-input-container">
                            <input
                                type="text"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., TypeScript"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="btn btn-secondary add-skill-btn"
                            >
                                Voeg toe
                            </button>
                        </div>
                    </div>
                    <div className="skills-list-container">
                        <div className="skills-list">
                            <h3>Must-have</h3>
                            <ul className="skills-pills">{renderSkillList("must")}</ul>
                        </div>
                        <div className="skills-list">
                            <h3>Nice-to-have</h3>
                            <ul className="skills-pills">{renderSkillList("nice")}</ul>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>AI Matching Criteria</h2>
                    {/* Sliders... */}
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                    Vacature Plaatsen & Matchen
                </button>
            </form>
        </div>
    );
};

// Exporting this masterpiece. The world isn't ready.
export default CreateVacancy;
