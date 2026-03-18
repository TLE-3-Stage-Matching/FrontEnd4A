const BASE_URL = 'https://back-end-main-2fian7.laravel.cloud/api/v2';
const API_KEY = '90a19e8f34c6b476b8bbbf38714dc9c8f9c5b8761896dac2bab385139cf54322';

export const apiRequest = async (path, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-KEY': API_KEY,
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(`${BASE_URL}${path}`, {...options, headers});

    if (response.status === 401 && token) {
        try {
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-KEY': API_KEY, // Cruciaal: ook hier de key meesturen
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!refreshResponse.ok) throw new Error('Refresh failed');

            const {token: newToken} = await refreshResponse.json();
            localStorage.setItem('token', newToken);

            // Retry met nieuwe token
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(`${BASE_URL}${path}`, {...options, headers});
        } catch (error) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw error;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: response.statusText}));
        throw new Error(errorData.message || 'API Error');
    }

    return response.status === 204 ? null : response.json();
};

// === Authentication ===
export const login = (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
});

export const logout = () => apiRequest('/auth/logout', {method: 'POST'});
export const getMe = () => apiRequest('/auth/me');

export const registerCompany = (payload) => apiRequest('/auth/register/company', {
    method: 'POST',
    body: JSON.stringify(payload),
});

export const registerCoordinator = (payload) => apiRequest('/auth/register/coordinator', {
    method: 'POST',
    body: JSON.stringify(payload),
});

// === Tags ===
export const getTags = () => apiRequest('/tags');

// === Public Data ===
export const getPublicVacancies = () => apiRequest('/vacancies'); // Added this function

// === Vacancies (Company) ===
export const getCompanyVacancies = () => apiRequest('/company/vacancies');
export const getVacancy = (id) => apiRequest(`/company/vacancies/${id}`);
export const createVacancy = (vacancyData) => apiRequest('/company/vacancies', {
    method: 'POST',
    body: JSON.stringify(vacancyData),
});
export const updateVacancy = (id, vacancyData) => apiRequest(`/company/vacancies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vacancyData),
});
export const deleteVacancy = (id) => apiRequest(`/company/vacancies/${id}`, {method: 'DELETE'});


// === Student ===
export const syncStudentTags = (tagsPayload) => apiRequest('/student/tags', {
    method: 'PUT',
    body: JSON.stringify({tags: tagsPayload}),
});
export const getStudentProfile = () => apiRequest('/student/profile');


// === Coordinator ===
export const getStudents = async () => {
    const response = await apiRequest('/coordinator/users?role=student');
    // Assuming the backend wraps the array in a "data" property
    return response.data;
};

export const createStudentUser = (studentData) => apiRequest('/coordinator/users', {
    method: 'POST',
    body: JSON.stringify(studentData),
});

// === Student Vacancy & Matching ===

export const getStudentVacancy = (vacancyId) => apiRequest(`/student/vacancies/${vacancyId}`);
export const getStudentVacancyDetail = (vacancyId) => apiRequest(`/student/vacancies/${vacancyId}/detail`);

export const applyForVacancy = (vacancyId, studentNote = "") => apiRequest('/student/match-choices', {
    method: 'POST',
    body: JSON.stringify({vacancy_id: vacancyId, student_note: studentNote}),
});
// === Applications (Match Choices in V2) ===
// Function for the Company: Get all candidates who applied for a specific vacancy
export const getApplicationsForVacancy = (vacancyId) => apiRequest(`/company/match-choices?vacancy_id=${vacancyId}`);

// Function for the Coordinator: Get all applications made by a specific student
export const getApplicationsForStudent = (studentId) => apiRequest(`/coordinator/match-choices?student_user_id=${studentId}`);
// export const getApplicationsForStudent = (studentId) => apiRequest(`/coordinator/users/${studentId}/applications`);

// === Sandbox (v2) ===
export const getSandboxVacancyDetail = (vacancyId, tags) =>
    apiRequest(`/student/sandbox/vacancies/${vacancyId}`, {
        method: 'POST',
        body: JSON.stringify({tags})
    });

export const getSandboxScoreExplanation = (vacancyId, tags) =>
    apiRequest(`/student/sandbox/vacancies/${vacancyId}/detail`, {
        method: 'POST',
        body: JSON.stringify({tags})
    });
