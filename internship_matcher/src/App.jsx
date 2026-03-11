import React, { useEffect, useState } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from "react-router-dom";
import { AppContext } from './context/AppContext';
import * as api from './api/client.js';

// --- Pageroute Imports ---
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Profile from "./pages/Profile.jsx";

// Registratie & Onboarding
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage.jsx";
import CoordinatorRegistrationPage from "./pages/CoordinatorRegistrationPage.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";

// Dashboards
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";

// Vacatures & Studenten Beheer
import CreateVacancy from "./pages/CreateVacancy.jsx";
import VacancyListings from "./pages/VacancyListings.jsx";
import CreateStudent from "./pages/CreateNewStudent.jsx";
import StudentResult from "./pages/StudentResult.jsx";
import MatchesDetails from "./pages/MatchesDetails.jsx";

// --- Component & Style Imports ---
import StudentApplications from "./components/StudentApplications.jsx";
import './App.css';

const Layout = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [appData, setAppData] = useState({
        vacancies: [],
        tags: [],
        allStudents: [],
        studentProfile: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data: userData } = await api.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Sessie ongeldig");
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        validateSession();
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchDataAndNavigate = async () => {
            setIsLoading(true);
            try {
                const tagsResult = await api.getTags();
                const newAppData = { ...appData, tags: tagsResult.data };

                if (user.role === 'student') {
                    const profileResult = await api.getStudentProfile();
                    const studentProfile = profileResult.data;

                    // Haal vacatures direct op als er tags zijn
                    let vacancies = [];
                    if (studentProfile.student_tags?.length > 0) {
                        const vacanciesResult = await api.getPublicVacancies();
                        vacancies = vacanciesResult.data;
                    }

                    // Update ALLES in één keer
                    setAppData(prev => ({
                        ...prev,
                        tags: tagsResult.data,
                        studentProfile: studentProfile,
                        vacancies: vacancies
                    }));

                    // Navigeer op basis van de lokale variabele, niet de state
                    if (studentProfile.student_tags?.length > 0) {
                        navigate('/dashboard/student');
                    } else {
                        navigate('/onboarding/student');
                    }
                } else if (user.role === 'company') {
                    const vacanciesResult = await api.getCompanyVacancies();
                    setAppData({ ...newAppData, vacancies: vacanciesResult.data });
                    navigate('/dashboard/bedrijf');
                } else if (user.role === 'coordinator') {
                    const studentsResult = await api.getStudents();
                    setAppData({ ...newAppData, allStudents: studentsResult.data });
                    navigate('/dashboard/coordinator');
                } else {
                    setAppData(newAppData);
                    navigate('/dashboard/coordinator');
                }
            } catch (error) {
                console.error("Fout bij ophalen data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataAndNavigate();
    }, [user, isAuthenticated]);

    const handleLogin = async (email, password) => {
        const { token } = await api.login(email, password);
        localStorage.setItem('token', token);
        const { data: userData } = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        if (window.confirm('Weet je zeker dat je wilt uitloggen?')) {
            try {
                await api.logout();
            } catch (e) { /* ignore */ }
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setAppData({ vacancies: [], tags: [], allStudents: [], studentProfile: null });
            navigate('/login');
        }
    };

    const createStudentUser = async (payload) => {
        setIsLoading(true);
        try {
            const res = await api.createStudentUser(payload);
            setAppData(prev => ({
                ...prev,
                allStudents: [...prev.allStudents, res.data]
            }));
            return res;
        } catch (error) {
            console.error("Fout bij aanmaken student:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue = {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        createStudentUser,
        students: appData.allStudents || [],
        ...appData,
        addVacancy: async (data) => {
            const res = await api.createVacancy(data);
            setAppData(prev => ({ ...prev, vacancies: [...prev.vacancies, res.data] }));
            navigate('/dashboard/bedrijf');
        },
        syncStudentTags: async (tagsPayload) => {
            await api.syncStudentTags(tagsPayload);
            const { data: updatedProfile } = await api.getStudentProfile();
            setAppData(prev => ({ ...prev, studentProfile: updatedProfile }));
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Outlet />
        </AppContext.Provider>
    );
};

function App() {
    const router = createBrowserRouter([
        {
            element: <Layout />,
            children: [
                // Algemene paden
                { path: "/", element: <HomePage /> },
                { path: "/login", element: <LoginPage /> },
                { path: "/profiel", element: <Profile /> },

                // Dashboards per rol
                { path: "/dashboard/student", element: <StudentDashboard /> },
                { path: "/dashboard/bedrijf", element: <CompanyDashboard /> },
                { path: "/dashboard/coordinator", element: <CoordinatorDashboard /> },

                // Registratie & Onboarding
                { path: "/register/bedrijf", element: <CompanyRegistrationPage /> },
                { path: "/register/coordinator", element: <CoordinatorRegistrationPage /> },
                { path: "/onboarding/student", element: <StudentOnboarding /> },

                // Vacatures
                { path: "/vacatures", element: <VacancyListings /> },
                { path: "/vacature/nieuw", element: <CreateVacancy /> },
                { path: "/vacature/bewerken/:id", element: <CreateVacancy /> },
                { path: "/vacature/:id/kandidaten", element: <StudentApplications /> },

                // Studenten & Resultaten
                { path: "/create/student", element: <CreateStudent /> },
                { path: "/matches", element: <MatchesDetails /> },
                { path: "/resultaten", element: <StudentResult /> },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}

export default App;