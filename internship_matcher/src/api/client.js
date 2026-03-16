// --- API Client ---
// This file is responsible for all communication with the backend API.

const BASE_URL = 'https://back-end-main-2fian7.laravel.cloud/api/v1';

/**
 * A wrapper for the fetch API that handles JWT authentication,
 * content types, and automatic token refreshing.
 * @param {string} path The API path (e.g., '/auth/login')
 * @param {object} options Options for the fetch request (method, body, etc.)
 * @returns {Promise<any>} The parsed JSON response data
 * @throws {Error} Throws an error if the request fails after all retries.
 */
export const apiRequest = async (path, options = {}) => {
    let token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(`${BASE_URL}${path}`, {...options, headers});

    if (response.status === 401 && token) {
        console.log("Token expired or invalid, attempting to refresh...");
        try {
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!refreshResponse.ok) {
                throw new Error('Session expired. Please log in again.');
            }

            const {token: newToken} = await refreshResponse.json();
            localStorage.setItem('token', newToken);
            console.log("Token refreshed successfully.");

            // Retry the original request with the new token
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(`${BASE_URL}${path}`, {...options, headers});

        } catch (error) {
            console.error("Failed to refresh token:", error.message);
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw error;
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: response.statusText}));
        const errorMessage = errorData.message || 'An unknown API error occurred.';
        console.error(`API Error on ${path}:`, errorMessage, errorData);
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// --- Specific API Functions ---

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
export const getStudents = () => apiRequest('/coordinator/users');
export const createStudentUser = (studentData) => apiRequest('/coordinator/users', {
    method: 'POST',
    body: JSON.stringify(studentData),
});


