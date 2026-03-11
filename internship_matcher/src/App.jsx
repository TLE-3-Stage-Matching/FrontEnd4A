import {useState, useEffect, useContext} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate, Navigate} from "react-router-dom";
import {AppContext} from './context/AppContext';
import * as api from './api/client.js';

// --- Component Imports ---
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CompanyDashboard from "./pages/company_dashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import Profile from "./pages/Profile.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";
import VacancyListings from "./pages/VacancyListings.jsx";
import './App.css';

// --- Private Route Component ---
const PrivateRoute = ({children}) => {
    const {isAuthenticated, isLoading} = useContext(AppContext);
    if (isLoading) return <div className="dashboard-container"><h1>Sessie controleren...</h1></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace/>;
    return children;
};

// --- Layout Component (The App's Brain) ---
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

    // When user logs in, fetch their data and navigate
    useEffect(() => {
        if (!user || !isAuthenticated) return;

        const fetchDataAndNavigate = async () => {
            // ... data fetching logic ...
            if (user.role === 'student') navigate('/dashboard/student');
            else if (user.role === 'company') navigate('/dashboard/bedrijf');
            else if (user.role === 'coordinator') navigate('/dashboard/coordinator');
        };
        fetchDataAndNavigate();
    }, [user, isAuthenticated, navigate]);

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
                console.error("Logout API call failed, but proceeding.");
            }
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Pass-through handlers that call the API
    const contextValue = {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        ...appData,
        addVacancy: async (data) => {
            const res = await api.createVacancy(data);
            setAppData(prev => ({...prev, vacancies: [...prev.vacancies, res.data]}));
        },
        updateVacancy: async (id, data) => {
            const res = await api.updateVacancy(id, data);
            setAppData(prev => ({...prev, vacancies: prev.vacancies.map(v => v.id === id ? res.data : v)}));
        },
        deleteVacancy: async (id) => {
            await api.deleteVacancy(id);
            setAppData(prev => ({...prev, vacancies: prev.vacancies.filter(v => v.id !== id)}));
        },
        syncStudentTags: api.syncStudentTags,
        createStudentUser: api.createStudentUser,
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Outlet/>
        </AppContext.Provider>
    );
};

// --- Main App & Router ---
function App() {
    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                // Public routes
                {path: "/", element: <HomePage/>},
                {path: "/login", element: <LoginPage/>},

                // Protected routes
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
