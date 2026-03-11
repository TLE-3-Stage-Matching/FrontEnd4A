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
import MatchesDetails from "./pages/MatchesDetails.jsx";
import StudentResult from "./pages/StudentResult.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";
import VacancyListings from "./pages/VacancyListings.jsx";
import DetailTestButton from "./pages/DetailTestButton.jsx";
import CreateNewStudent from "./pages/CreateNewStudent.jsx";
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

    // Sessie valideren bij opstarten
    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const {data: userData} = await api.getMe();
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

    // Data ophalen en navigeren na login
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchDataAndNavigate = async () => {
            setIsLoading(true);
            try {
                const tagsResult = await api.getTags();
                const newAppData = {...appData, tags: tagsResult.data};

                if (user.role === 'student') {
                    const profileResult = await api.getStudentProfile();
                    newAppData.studentProfile = profileResult.data;
                    setAppData(newAppData);

                    if (profileResult.data.student_tags?.length > 0) {
                        const vacanciesResult = await api.getPublicVacancies();
                        setAppData(prev => ({
                            ...prev,
                            vacancies: vacanciesResult.data,
                            studentProfile: profileResult.data
                        }));
                        navigate('/dashboard/student');
                    } else {
                        navigate('/onboarding/student');
                    }
                } else if (user.role === 'company') {
                    const vacanciesResult = await api.getCompanyVacancies();
                    setAppData({...newAppData, vacancies: vacanciesResult.data});
                    navigate('/dashboard/bedrijf');
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
            } catch (e) { /* ignore */
            }
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setAppData({vacancies: [], tags: [], allStudents: [], studentProfile: null});
            navigate('/login');
        }
    };

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
            navigate('/dashboard/bedrijf');
        },
        syncStudentTags: async (tagsPayload) => {
            await api.syncStudentTags(tagsPayload);
            const {data: updatedProfile} = await api.getStudentProfile();
            setAppData(prev => ({...prev, studentProfile: updatedProfile}));
        }
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Outlet/>
        </AppContext.Provider>
    );
};

function App() {
    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {path: "/", element: <HomePage/>},
                {path: "/login", element: <LoginPage/>},
                {path: "/profiel", element: <Profile/>},
                {path: "/onboarding/student", element: <StudentOnboarding/>},
                {path: "/dashboard/bedrijf", element: <CompanyDashboard/>},
                {path: "/dashboard/student", element: <StudentDashboard/>},
                {path: "/dashboard/coordinator", element: <CoordinatorDashboard/>},
                {path: "/vacature/nieuw", element: <CreateVacancy/>},
                {path: "/vacature/bewerken/:id", element: <CreateVacancy/>},
                {path: "/register/bedrijf", element: <CompanyRegistrationPage/>},
                {path: "/register/coordinator", element: <CoordinatorRegistrationPage/>},
                {path: "/matches", element: <MatchesDetails/>},
                {path: "/vacatures", element: <VacancyListings/>},
                {path: "/Resultaten", element: <StudentResult/>},
            ]
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;