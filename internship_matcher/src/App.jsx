import React, {useEffect, useState, useCallback, useRef} from 'react';
import {createBrowserRouter, Outlet, RouterProvider, useNavigate} from "react-router-dom";
import {AppContext} from './context/AppContext';
import * as api from './api/client.js';

// Page Imports
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Profile from "./pages/Profile.jsx";
import CompanyRegistrationPage from "./pages/CompanyRegistrationPage.jsx";
import CoordinatorRegistrationPage from "./pages/CoordinatorRegistrationPage.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CompanyDashboard from "./pages/CompanyDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import VacancyListings from "./pages/VacancyListings.jsx";
import CreateStudent from "./pages/CreateNewStudent.jsx";
import StudentResult from "./pages/StudentResult.jsx";
import MatchesDetails from "./pages/MatchesDetails.jsx";
import StudentApplications from "./components/StudentApplications.jsx";
import './App.css';
import Sandbox from "./pages/Sandbox.jsx";
import Toast from "./components/Toast.jsx";
import MatchDetails from "./pages/MatchDetails.jsx";

const Layout = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [appData, setAppData] = useState({
        vacancies: [],
        tags: [],
        allStudents: [],
        studentProfile: null,
        learningGoals: JSON.parse(localStorage.getItem('learningGoals')) || [],
    });

    const [toastMessage, setToastMessage] = useState(null);
    const toastTimeoutRef = useRef(null);
    const navigate = useNavigate();

    // 1. Session Validation (Runs once on load to check for existing token)
    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const {data} = await api.getMe();
                    setUser(data);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        validateSession();
    }, []);

    // 2. Role-based Data Fetching (Runs whenever user logs in or auth state changes)
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const {data: tags} = await api.getTags();

                if (user.role === 'student') {
                    const {data: profile} = await api.getStudentProfile();
                    let vacancies = [];
                    if (profile.student_tags?.length > 0) {
                        const vacRes = await api.getPublicVacancies();
                        vacancies = vacRes.data || vacRes;
                    }
                    setAppData(prev => ({...prev, tags, studentProfile: profile, vacancies}));
                    navigate(profile.student_tags?.length > 0 ? '/dashboard/student' : '/onboarding/student');
                } else if (user.role === 'company') {
                    const vacRes = await api.getCompanyVacancies();
                    setAppData(prev => ({...prev, tags, vacancies: vacRes.data || vacRes}));
                    navigate('/dashboard/bedrijf');
                } else if (user.role === 'coordinator') {
                    const stuRes = await api.getStudents();
                    const students = Array.isArray(stuRes) ? stuRes : (stuRes.data || []);
                    setAppData(prev => ({...prev, tags, allStudents: students}));
                    navigate('/dashboard/coordinator');
                }
            } catch (error) {
                console.error("Dashboard load failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Trigger the loading function
        loadDashboardData();
    }, [user, isAuthenticated, navigate]); // <-- THIS DEPENDENCY ARRAY WAS BROKEN!

    // --- MEMOIZED FUNCTIONS USING useCallback ---
    const handleLogin = useCallback(async (email, password) => {
        const {token} = await api.login(email, password);
        localStorage.setItem('token', token);
        const {data: userData} = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
        // The useEffect above will now automatically catch this and navigate!
    }, []);

    const handleLogout = useCallback(() => {
        if (window.confirm('Weet je zeker dat je wilt uitloggen?')) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setAppData({vacancies: [], tags: [], allStudents: [], studentProfile: null});
            navigate('/login');
        }
    }, [navigate]);

    const createStudentUser = useCallback(async (payload) => {
        setIsLoading(true);
        try {
            const res = await api.createStudentUser(payload);
            const newStudent = res.data || res;
            setAppData(prev => ({
                ...prev,
                allStudents: Array.isArray(prev.allStudents) ? [...prev.allStudents, newStudent] : [newStudent]
            }));
            return res;
        } catch (error) {
            console.error("Fout bij aanmaken student:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addVacancy = useCallback(async (data) => {
        const res = await api.createVacancy(data);
        setAppData(prev => ({...prev, vacancies: [...(prev.vacancies || []), res.data || res]}));
        navigate('/dashboard/bedrijf');
    }, [navigate]);

    // --- RESTORED DELETE & UPDATE FUNCTIONS ---
    const deleteVacancy = useCallback(async (id) => {
        try {
            await api.deleteVacancy(id);
            setAppData(prev => ({
                ...prev,
                vacancies: prev.vacancies.filter(v => v.id !== id)
            }));
        } catch (error) {
            console.error("Fout bij verwijderen vacature:", error);
            alert("Er is iets misgegaan bij het verwijderen van de vacature.");
        }
    }, []);

    const updateVacancy = useCallback(async (id, data) => {
        try {
            const res = await api.updateVacancy(id, data);
            setAppData(prev => ({
                ...prev,
                vacancies: prev.vacancies.map(v => v.id === id ? (res.data || res) : v)
            }));
            navigate('/dashboard/bedrijf');
        } catch (error) {
            console.error("Fout bij updaten vacature:", error);
            alert("Er is iets misgegaan bij het opslaan van de wijzigingen.");
        }
    }, [navigate]);

    const syncStudentTags = useCallback(async (tags) => {
        await api.syncStudentTags(tags);
        const {data} = await api.getStudentProfile();
        setAppData(prev => ({...prev, studentProfile: data}));
    }, []);

    //////// TOAST & LEERDOELEN ////////
    const showToast = useCallback((message) => {
        if (toastTimeoutRef.current) return;
        setToastMessage(message);
        toastTimeoutRef.current = setTimeout(() => {
            setToastMessage(null);
            toastTimeoutRef.current = null;
        }, 1000);
    }, []);

    const saveLearningGoal = useCallback((vacancy, skill) => {
        setAppData(prev => {
            const existingGoals = prev.learningGoals || [];
            const vacancyIndex = existingGoals.findIndex(g => g.vacancy.id === vacancy.id);
            let updatedGoals;

            if (vacancyIndex >= 0) {
                updatedGoals = [...existingGoals];
                const hasSkill = updatedGoals[vacancyIndex].skills.some(s => s.id === skill.id);
                if (!hasSkill) {
                    updatedGoals[vacancyIndex].skills.push(skill);
                }
            } else {
                updatedGoals = [...existingGoals, {vacancy, skills: [skill]}];
            }

            localStorage.setItem('learningGoals', JSON.stringify(updatedGoals));
            return {...prev, learningGoals: updatedGoals};
        });
        showToast(`Leerdoel '${skill.name}' opgeslagen!`);
    }, [showToast]);

    const removeLearningGoal = useCallback((vacancyId, skillId) => {
        setAppData(prev => {
            const existingGoals = prev.learningGoals || [];
            const updatedGoals = existingGoals.map(goal => {
                if (goal.vacancy.id === vacancyId) {
                    return {
                        ...goal,
                        skills: goal.skills.filter(skill => skill.id !== skillId)
                    };
                }
                return goal;
            }).filter(goal => goal.skills.length > 0);

            localStorage.setItem('learningGoals', JSON.stringify(updatedGoals));
            return {...prev, learningGoals: updatedGoals};
        });
    }, []);

    const contextValue = {
        user, isAuthenticated, isLoading,
        login: handleLogin,
        logout: handleLogout,
        createStudentUser,
        students: appData.allStudents || [],
        vacancies: appData.vacancies || [],
        tags: appData.tags || [],
        studentProfile: appData.studentProfile,
        learningGoals: appData.learningGoals || [],
        saveLearningGoal,
        removeLearningGoal,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        syncStudentTags
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Outlet/>
            <Toast message={toastMessage}/>
        </AppContext.Provider>
    );
};

// Router
function App() {
    const router = createBrowserRouter([{
        element: <Layout/>,
        children: [
            {path: "/", element: <HomePage/>},
            {path: "/login", element: <LoginPage/>},
            {path: "/profiel", element: <Profile/>},
            {path: "/dashboard/student", element: <StudentDashboard/>},
            {path: "/dashboard/bedrijf", element: <CompanyDashboard/>},
            {path: "/dashboard/coordinator", element: <CoordinatorDashboard/>},
            {path: "/register/bedrijf", element: <CompanyRegistrationPage/>},
            {path: "/register/coordinator", element: <CoordinatorRegistrationPage/>},
            {path: "/onboarding/student", element: <StudentOnboarding/>},
            {path: "/vacatures", element: <VacancyListings/>},
            {path: "/vacature/nieuw", element: <CreateVacancy/>},
            {path: "/vacature/bewerken/:id", element: <CreateVacancy/>},
            {path: "/vacature/:id/kandidaten", element: <StudentApplications/>},
            {path: "/coordinator/student/:id", element: <StudentApplications role="coordinator"/>},
            {path: "/create/student", element: <CreateStudent/>},
            {path: "/matches", element: <MatchesDetails/>},
            {path: "/resultaten", element: <StudentResult/>},
            {path: "/sandbox/:id", element: <Sandbox/>},
            {path: "/vacancies/:id", element: <Sandbox/>},
            {path: "/vacature/student/:id", element: <MatchDetails/>},
        ]
    }]);
    return <RouterProvider router={router}/>;
}

export default App;