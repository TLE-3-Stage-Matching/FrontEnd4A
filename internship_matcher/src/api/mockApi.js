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
        skills: [{id: 1, name: 'React', type: 'must'}, {id: 2, name: 'CSS', type: 'nice'}]
    },
    {
        id: 2,
        title: 'UX/UI Design Stage',
        applications: 5,
        matches: 5,
        description: "Een design stageplek.",
        skills: [{id: 5, name: 'Figma', type: 'must'}]
    },
    {
        id: 3,
        title: 'Backend Developer Stage',
        applications: 2,
        matches: 1,
        description: "Een backend stageplek.",
        skills: [{id: 4, name: 'Node.js', type: 'must'}]
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

let nextVacancyId = 4;

// --- Helper to simulate network delay ---
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock API Functions ---

// GET /company/vacancies
export const getVacancies = async () => {
    await simulateDelay();
    console.log("Mock API: Fetched vacancies");
    return [...mockVacancies]; // Return a copy
};

// POST /company/vacancies
export const createVacancy = async (vacancyData) => {
    await simulateDelay();
    const newVacancy = {
        ...vacancyData,
        id: nextVacancyId++,
        applications: 0,
        matches: 0,
    };
    mockVacancies.push(newVacancy);
    console.log("Mock API: Created vacancy", newVacancy);
    return newVacancy;
};

// PUT /company/vacancies/{id}
export const updateVacancy = async (updatedVacancy) => {
    await simulateDelay();
    mockVacancies = mockVacancies.map(v => v.id === updatedVacancy.id ? updatedVacancy : v);
    console.log("Mock API: Updated vacancy", updatedVacancy);
    return updatedVacancy;
};

// DELETE /company/vacancies/{id}
export const deleteVacancy = async (idToDelete) => {
    await simulateDelay();
    mockVacancies = mockVacancies.filter(v => v.id !== idToDelete);
    console.log("Mock API: Deleted vacancy with ID:", idToDelete);
    return {message: "Vacancy deleted successfully."};
};

// GET /tags
export const getTags = async () => {
    await simulateDelay();
    console.log("Mock API: Fetched tags");
    return [...mockTags];
};

// PUT /student/tags
export const syncStudentTags = async (payload) => {
    await simulateDelay();
    // In a real app, we'd save this to a student's profile. Here, we just log it.
    console.log("Mock API: Synced student tags", payload);
    return {message: "Tags updated successfully.", data: payload.tags};
};

// POST /coordinator/users
export const createStudentUser = async (payload) => {
    await simulateDelay();
    console.log("Mock API: Created student user", payload);
    // Return a dummy user object
    return {data: {id: 101, ...payload}};
};

// This simulates the login and fetching of the current user
export const loginAndGetUser = async (role) => {
    await simulateDelay();
    console.log(`Mock API: Logged in as ${role}`);
    return {
        role: role,
        first_name: "Test",
        last_name: role === 'bedrijf' ? 'Bedrijf' : 'Student',
        email: `${role}@test.com`,
    };
};
