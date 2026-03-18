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

    // Session Validation
    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const {data} = await api.getMe();
                    setUser(data);
                    setIsAuthenticated(true);
                    // Now that we have the user, load their data and navigate
                    await loadDataAndNavigate(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                    setIsLoading(false);
                }
            }
            setIsLoading(false);
        };
        validateSession();
    }, []);

    // Role-based Data Fetching
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
                    // Safety check for array
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
        validateSession();
    }, []); // Runs only once

    // --- MEMOIZED FUNCTIONS USING useCallback ---
    const handleLogin = useCallback(async (email, password) => {
        const {token} = await api.login(email, password);
        localStorage.setItem('token', token);
        const {data: userData} = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
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
            console.log("--- DEBUG: Student aanmaken gestart ---");
            console.log("Payload naar backend:", payload);

            const res = await api.createStudentUser(payload);

            console.log("Antwoord van backend na aanmaken:", res);
            const newStudent = res.data || res;

            if (!newStudent.coordinator_id) {
                console.warn("WAARSCHUWING: De nieuwe student heeft geen 'coordinator_id'. " +
                    "De kans is groot dat deze student na het uitloggen niet meer zichtbaar is.");
            }

            setAppData(prev => ({
                ...prev,
                allStudents: Array.isArray(prev.allStudents) ? [...prev.allStudents, newStudent] : [newStudent]
            }));

            console.log("--- DEBUG: Student succesvol toegevoegd aan state ---");
            return res;
        } catch (error) {
            console.error("DEBUG: Fout bij aanmaken student:", error);
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

    const syncStudentTags = useCallback(async (tags) => {
        await api.syncStudentTags(tags);
        const {data} = await api.getStudentProfile();
        setAppData(prev => ({...prev, studentProfile: data}));
    }, []);

    //////// LEERDOELEN OPSLAAN IN CONTEXT//////
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

            let updatedGoals; // We create a variable to hold the new array

            if (vacancyIndex >= 0) {
                updatedGoals = [...existingGoals];
                const hasSkill = updatedGoals[vacancyIndex].skills.some(s => s.id === skill.id);
                if (!hasSkill) {
                    updatedGoals[vacancyIndex].skills.push(skill);
                }
            } else {
                updatedGoals = [...existingGoals, {vacancy, skills: [skill]}];
            }

            // === THE NEW LINE ===
            // Save the updated array directly to the browser's local storage
            localStorage.setItem('learningGoals', JSON.stringify(updatedGoals));

            // Return the updated state to React
            return {...prev, learningGoals: updatedGoals};
        });
        showToast(`Leerdoel '${skill.name}' opgeslagen!`);
    }, [showToast]);

    //////// LEERDOEL VERWIJDEREN ////////
    const removeLearningGoal = useCallback((vacancyId, skillId) => {
        setAppData(prev => {
            const existingGoals = prev.learningGoals || [];

            // Filter out the specific skill, and then filter out any vacancies that have 0 skills left
            const updatedGoals = existingGoals.map(goal => {
                if (goal.vacancy.id === vacancyId) {
                    return {
                        ...goal,
                        skills: goal.skills.filter(skill => skill.id !== skillId)
                    };
                }
                return goal;
            }).filter(goal => goal.skills.length > 0); // Removes the whole block if empty

            // Update local storage so the deletion is permanent
            localStorage.setItem('learningGoals', JSON.stringify(updatedGoals));

            return {...prev, learningGoals: updatedGoals};
        });
    }, []);

    async function handleCreateStudent(payload) {
        const newUser = await api.createStudentUser(payload);
        setAppData(prev => ({
            ...prev,
            allStudents: [...(Array.isArray(prev.allStudents) ? prev.allStudents : []), newUser.data]
        }));
        return newUser;
    }

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
        syncStudentTags
    };


    return (
        <AppContext.Provider value={contextValue}>
            <Outlet/>
            <Toast message={toastMessage}/>
        </AppContext.Provider>
    );
};

// Router remains exactly the same as your original file
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
            // For the Company (Defaults to role="company")
            {path: "/vacature/:id/kandidaten", element: <StudentApplications/>},
            // For the Coordinator
            {path: "/coordinator/student/:id", element: <StudentApplications role="coordinator"/>},
            {path: "/create/student", element: <CreateStudent/>},
            {path: "/matches", element: <MatchesDetails/>},
            {path: "/resultaten", element: <StudentResult/>},
            {path: "/sandbox/:id", element: <Sandbox/>},
            {path: "/vacancies/:id", element: <Sandbox/>}
        ]
    }]);
    return <RouterProvider router={router}/>;
}

export default App;