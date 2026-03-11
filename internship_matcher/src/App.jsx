import {useState, useEffect, useContext} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate, Navigate} from "react-router-dom";
import {AppContext} from './context/AppContext';
import * as api from './api/client.js';

// --- Component Imports ---
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage.jsx";
import CoordinatorRegistrationPage from "./pages/CoordinatorRegistrationPage.jsx";
import CompanyDashboard from "./pages/company_dashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import Profile from "./pages/Profile.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";
import VacancyListings from "./pages/VacancyListings.jsx";
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
    });
    const navigate = useNavigate();

    // On initial load, validate session
    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const {data: userData} = await api.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        validateSession();
    }, []);

    // When user authenticates, fetch data and navigate
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchDataAndNavigate = async () => {
            setIsLoading(true);
            try {
                // Collect all data first
                const tagsResult = await api.getTags();
                const newAppData = {tags: tagsResult.data};

                if (user.role === 'student') {
                    const profileResult = await api.getStudentProfile();
                    newAppData.studentProfile = profileResult.data;

                    if (profileResult.data.student_tags && profileResult.data.student_tags.length > 0) {
                        const vacanciesResult = await api.getPublicVacancies();
                        newAppData.vacancies = vacanciesResult.data;
                        setAppData(newAppData); // Single state update
                        navigate('/dashboard/student');
                    } else {
                        setAppData(newAppData); // Single state update
                        navigate('/onboarding/student');
                    }
                } else if (user.role === 'company') {
                    const vacanciesResult = await api.getCompanyVacancies();
                    newAppData.vacancies = vacanciesResult.data;
                    setAppData(newAppData); // Single state update
                    navigate('/dashboard/bedrijf');
                } else {
                    setAppData(newAppData); // Single state update
                    navigate('/dashboard/coordinator');
                }
            } catch (error) {
                console.error("An error occurred during data fetching:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataAndNavigate();
    }, [user, isAuthenticated]); // navigate is not needed here

    // --- Handlers ---
    const handleLogin = async (email, password) => {
        const {token} = await api.login(email, password);
        localStorage.setItem('token', token);
        const {data: userData} = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        if (window.confirm('Weet je zeker dat je wilt uitloggen?')) {
            try {
                await api.logout();
            } catch (e) {
                console.error("Logout API call failed.");
            }
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setAppData({vacancies: [], tags: [], allStudents: [], studentProfile: null});
            navigate('/login');
        }
    };

    const handleSyncStudentTags = async (tagsPayload) => {
        await api.syncStudentTags(tagsPayload);
        const {data: updatedProfile} = await api.getStudentProfile();
        setAppData(prev => ({...prev, studentProfile: updatedProfile}));
    };
    
    const contextValue = {
        user, isAuthenticated, isLoading, login: handleLogin, logout: handleLogout, ...appData,
        addVacancy: async (data) => {
            const res = await api.createVacancy(data);
            setAppData(prev => ({...prev, vacancies: [...prev.vacancies, res.data]}));
            navigate('/dashboard/bedrijf');
        },
        updateVacancy: async (id, data) => {
            const res = await api.updateVacancy(id, data);
            setAppData(prev => ({...prev, vacancies: prev.vacancies.map(v => v.id === id ? res.data : v)}));
            navigate('/dashboard/bedrijf');
        },
        deleteVacancy: async (id) => {
            if (window.confirm('Weet je zeker dat je deze vacature wilt verwijderen?')) {
                await api.deleteVacancy(id);
                setAppData(prev => ({...prev, vacancies: prev.vacancies.filter(v => v.id !== id)}));
            }
        },
        createStudentUser: api.createStudentUser,
        syncStudentTags: handleSyncStudentTags,
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
            ]
        }
    ]);
    return <RouterProvider router={router}/>;
}

export default App;
