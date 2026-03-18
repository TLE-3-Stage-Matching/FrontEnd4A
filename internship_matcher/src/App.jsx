import {useState, useEffect, useContext} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate, Navigate} from "react-router-dom";
import {AppContext} from './context/AppContext';
import * as api from './api/client.js';

// --- Component Imports ---
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage.jsx";
import CoordinatorRegistrationPage from "./pages/CoordinatorRegistrationPage.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import Profile from "./pages/Profile.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";
import VacancyListings from "./pages/VacancyListings.jsx";
import StudentApplicationsPage from './pages/StudentApplicationsPage.jsx';
import './App.css';

const PrivateRoute = ({children}) => {
    const {isAuthenticated, isLoading} = useContext(AppContext);
    if (isLoading) return <div className="dashboard-container"><h1>Sessie controleren...</h1></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace/>;
    return children;
};

const Layout = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [appData, setAppData] = useState({
        vacancies: [],
        tags: [],
        allStudents: [],
        studentProfile: null,
        allCompanies: [],
    });
    const navigate = useNavigate();

    // This new function centralizes data loading and navigation
    const loadDataAndNavigate = async (loggedInUser) => {
        if (!loggedInUser) return;

        setIsLoading(true);
        try {
            const [tagsRes, studentsRes] = await Promise.all([
                api.getTags(),
                api.getUsers('student') // Fetch all students for all roles (for live counters etc.)
            ]);

            const newAppData = {
                tags: tagsRes.data || [],
                allStudents: studentsRes.data || [],
                vacancies: [],
                studentProfile: null,
                allCompanies: [],
            };

            if (loggedInUser.role === 'student') {
                const {data: profile} = await api.getStudentProfile();
                newAppData.studentProfile = profile;
                if (profile.student_tags?.length > 0) {
                    const vacRes = await api.getPublicVacancies();
                    newAppData.vacancies = vacRes.data || [];
                    navigate('/dashboard/student');
                } else {
                    navigate('/onboarding/student');
                }
            } else if (loggedInUser.role === 'company') {
                const vacRes = await api.getCompanyVacancies();
                newAppData.vacancies = vacRes.data || [];
                navigate('/dashboard/bedrijf');
            } else if (loggedInUser.role === 'coordinator') {
                const compRes = await api.getCompanies();
                newAppData.allCompanies = compRes.data || [];
                navigate('/dashboard/coordinator');
            }

            setAppData(newAppData);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            // If data loading fails, maybe log out to be safe
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };

    // Session Validation on initial app load
    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const {data: userData} = await api.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                    // Now that we have the user, load their data and navigate
                    await loadDataAndNavigate(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        validateSession();
    }, []); // Runs only once

    // --- CONTEXT HANDLERS ---
    async function handleLogin(email, password) {
        const {token} = await api.login(email, password);
        localStorage.setItem('token', token);
        const {data: userData} = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
        // Data loading and navigation is now handled by the session validation logic,
        // but we can also trigger it here to be faster.
        await loadDataAndNavigate(userData);
    }

    function handleLogout() {
        if (window.confirm('Weet je zeker dat je wilt uitloggen?')) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setAppData({vacancies: [], tags: [], allStudents: [], studentProfile: null, allCompanies: []});
            navigate('/login');
        }
    }

    async function handleUpdateCompanyStatus(companyId, isActive) {
        const {data: updatedCompany} = await api.updateCompany(companyId, {is_active: isActive});
        setAppData(prev => ({
            ...prev,
            allCompanies: prev.allCompanies.map(c => c.id === companyId ? updatedCompany : c)
        }));
    }

    async function handleSyncStudentTags(tagsPayload) {
        await api.syncStudentTags(tagsPayload);
        const {data: updatedProfile} = await api.getStudentProfile();
        setAppData(prev => ({...prev, studentProfile: updatedProfile}));
    }

    async function handleCreateStudent(payload) {
        const newUser = await api.createStudentUser(payload);
        setAppData(prev => ({
            ...prev,
            allStudents: [...(Array.isArray(prev.allStudents) ? prev.allStudents : []), newUser.data]
        }));
        return newUser;
    }

    const contextValue = {
        user, isAuthenticated, isLoading, ...appData,
        login: handleLogin,
        logout: handleLogout,
        updateCompanyStatus: handleUpdateCompanyStatus,
        syncStudentTags: handleSyncStudentTags,
        createStudentUser: handleCreateStudent,
    };

    return <AppContext.Provider value={contextValue}><Outlet/></AppContext.Provider>;
};

function App() {
    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {path: "/", element: <HomePage/>},
                {path: "/login", element: <LoginPage/>},
                {path: "/register/bedrijf", element: <CompanyRegistrationPage/>},
                {path: "/register/coordinator", element: <CoordinatorRegistrationPage/>},
                {path: "/profiel", element: <PrivateRoute><Profile/></PrivateRoute>},
                {path: "/onboarding/student", element: <PrivateRoute><StudentOnboarding/></PrivateRoute>},
                {path: "/dashboard/bedrijf", element: <PrivateRoute><CompanyDashboard/></PrivateRoute>},
                {path: "/dashboard/student", element: <PrivateRoute><StudentDashboard/></PrivateRoute>},
                {path: "/dashboard/coordinator", element: <PrivateRoute><CoordinatorDashboard/></PrivateRoute>},
                {path: "/vacature/nieuw", element: <PrivateRoute><CreateVacancy/></PrivateRoute>},
                {path: "/vacature/bewerken/:id", element: <PrivateRoute><CreateVacancy/></PrivateRoute>},
                {path: "/vacatures", element: <PrivateRoute><VacancyListings/></PrivateRoute>},
                {
                    path: "/coordinator/student/:studentId/applications",
                    element: <PrivateRoute><StudentApplicationsPage/></PrivateRoute>
                },
            ]
        }
    ]);
    return <RouterProvider router={router}/>;
}

export default App;
