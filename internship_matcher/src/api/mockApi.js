// This file simulates a backend API by returning hardcoded data with a delay.
// This makes it easy to swap out for real API calls in the future.

// --- Mock Database ---

let mockVacancies = [
    {
        id: 1,
        title: 'Frontend Developer Stagiair',
        applications: 12,
        matches: 8,
        description: "Een frontend stageplek.",
        skills: [{id: 1, name: 'React', type: 'must'}, {id: 3, name: 'CSS', type: 'must'}, {
            id: 10,
            name: 'Python',
            type: 'nice'
        }]
    },
    {
        id: 2,
        title: 'UX/UI Design Stage',
        applications: 5,
        matches: 5,
        description: "Een design stageplek.",
        skills: [{id: 5, name: 'Figma', type: 'must'}, {id: 6, name: 'UI/UX Design', type: 'must'}]
    },
    {
        id: 3,
        title: 'Backend Developer Stage',
        applications: 2,
        matches: 1,
        description: "Een backend stageplek.",
        skills: [{id: 4, name: 'Node.js', type: 'must'}, {id: 7, name: 'SQL', type: 'must'}]
    },
];

let mockTags = [
    {id: 1, name: 'React', tag_type: 'skill'},
    {id: 2, name: 'JavaScript', tag_type: 'skill'},
    {id: 3, name: 'CSS', tag_type: 'skill'},
    {id: 4, name: 'Node.js', tag_type: 'skill'},
    {id: 5, name: 'Figma', tag_type: 'skill'},
    {id: 6, name: 'UI/UX Design', tag_type: 'skill'},
    {id: 7, name: 'SQL', tag_type: 'skill'},
    {id: 8, name: 'Project Management', tag_type: 'skill'},
    {id: 9, name: 'Agile', tag_type: 'skill'},
    {id: 10, name: 'Python', tag_type: 'skill'},
];

const mockStudentProfile = {
    user: {id: 101, name: 'Test Student'},
    // A student has a set of tags they possess. We only need the IDs.
    skills: new Set([1, 2, 5, 9]), // Has React, JS, Figma, Agile
};

const mockStudents = [
    {id: 201, skills: new Set([1, 2, 3])}, // React, JS, CSS
    {id: 202, skills: new Set([4, 7])},    // Node.js, SQL
    {id: 203, skills: new Set([5, 6])},    // Figma, UI/UX
    {id: 204, skills: new Set([1, 2, 4])}, // React, JS, Node.js
    {id: 205, skills: new Set([1, 3, 5])}, // React, CSS, Figma
    {id: 206, skills: new Set([10])},      // Python
    {id: 207, skills: new Set([8, 9])},    // PM, Agile
    {id: 208, skills: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}, // Full stack
    {id: 209, skills: new Set([1])},       // React only
    {id: 210, skills: new Set([4])},       // Node.js only
    {id: 211, skills: new Set([1, 5])},    // React, Figma
    {id: 212, skills: new Set([2, 4])},    // JS, Node.js
];

let nextVacancyId = 4;

// --- Helper to simulate network delay ---
const simulateDelay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));


// --- Mock API Functions ---

export const getVacancies = async () => {
    await simulateDelay();
    console.log("Mock API: Fetched vacancies");
    return [...mockVacancies];
};

export const createVacancy = async (vacancyData) => {
    await simulateDelay();
    const newVacancy = {...vacancyData, id: nextVacancyId++, applications: 0, matches: 0};
    mockVacancies.push(newVacancy);
    return newVacancy;
};

export const updateVacancy = async (updatedVacancy) => {
    await simulateDelay();
    mockVacancies = mockVacancies.map(v => v.id === updatedVacancy.id ? updatedVacancy : v);
    return updatedVacancy;
};

export const deleteVacancy = async (idToDelete) => {
    await simulateDelay();
    mockVacancies = mockVacancies.filter(v => v.id !== idToDelete);
    return {message: "Vacancy deleted successfully."};
};

export const getTags = async () => {
    await simulateDelay();
    console.log("Mock API: Fetched tags");
    return [...mockTags];
};

export const syncStudentTags = async (payload) => {
    await simulateDelay();
    mockStudentProfile.skills = new Set(payload.tags.map(t => t.tag_id));
    console.log("Mock API: Synced student tags. New skills:", mockStudentProfile.skills);
    return {message: "Tags updated successfully."};
};

export const createStudentUser = async (payload) => {
    await simulateDelay();
    console.log("Mock API: Created student user", payload);
    return {data: {id: 101, ...payload}};
};

export const loginAndGetUser = async (role) => {
    await simulateDelay();
    return {role: role, first_name: "Test", last_name: role.charAt(0).toUpperCase() + role.slice(1)};
};

export const getStudentProfile = async () => {
    await simulateDelay();
    console.log("Mock API: Fetched student profile");
    // We need to resolve the skill IDs to full tag objects
    const profileWithFullSkills = {
        ...mockStudentProfile,
        skills: mockTags.filter(tag => mockStudentProfile.skills.has(tag.id))
    };
    return profileWithFullSkills;
};

// New: Function to get all students
export const getStudents = async () => {
    await simulateDelay();
    console.log("Mock API: Fetched all students");
    return [...mockStudents];
};
