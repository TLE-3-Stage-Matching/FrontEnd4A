import {useState, useEffect, useContext, useCallback} from 'react';
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

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const {data: tags} = await api.getTags();
                let newAppData = {tags};

                if (user.role === 'student') {
                    const {data: profile} = await api.getStudentProfile();
                    newAppData.studentProfile = profile;
                    if (profile.student_tags?.length > 0) {
                        const vacRes = await api.getPublicVacancies();
                        newAppData.vacancies = vacRes.data || [];
                        setAppData(prev => ({...prev, ...newAppData}));
                        navigate('/dashboard/student');
                    } else {
                        setAppData(prev => ({...prev, ...newAppData}));
                        navigate('/onboarding/student');
                    }
                } else if (user.role === 'company') {
                    const vacRes = await api.getCompanyVacancies();
                    newAppData.vacancies = vacRes.data || [];
                    setAppData(prev => ({...prev, ...newAppData}));
                    navigate('/dashboard/bedrijf');
                } else if (user.role === 'coordinator') {
                    const [stuRes, compRes] = await Promise.all([api.getUsers('student'), api.getCompanies()]);
                    newAppData.allStudents = stuRes.data || [];
                    newAppData.allCompanies = compRes.data || [];
                    setAppData(prev => ({...prev, ...newAppData}));
                    navigate('/dashboard/coordinator');
                }
            } catch (error) {
                console.error("Dashboard load failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [user, isAuthenticated, navigate]);

    const handleLogin = useCallback(async (email, password) => {
        const {token} = await api.login(email, password);
        localStorage.setItem('token', token);
        const {data} = await api.getMe();
        setUser(data);
        setIsAuthenticated(true);
    }, []);

    const handleLogout = useCallback(() => {
        if (window.confirm('Weet je zeker dat je wilt uitloggen?')) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setAppData({vacancies: [], tags: [], allStudents: [], studentProfile: null, allCompanies: []});
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateCompanyStatus = useCallback(async (companyId, isActive) => {
        const {data: updatedCompany} = await api.updateCompany(companyId, {is_active: isActive});
        setAppData(prev => ({
            ...prev,
            allCompanies: prev.allCompanies.map(c => c.id === companyId ? updatedCompany : c)
        }));
    }, []);

    const handleSyncStudentTags = useCallback(async (tagsPayload) => {
        await api.syncStudentTags(tagsPayload);
        const {data: updatedProfile} = await api.getStudentProfile();
        setAppData(prev => ({...prev, studentProfile: updatedProfile}));
    }, []);

    const contextValue = {
        user, isAuthenticated, isLoading, ...appData,
        login: handleLogin,
        logout: handleLogout,
        updateCompanyStatus: handleUpdateCompanyStatus,
        syncStudentTags: handleSyncStudentTags,
        createStudentUser: api.createStudentUser,
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
