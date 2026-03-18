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

    const showToast = useCallback((message) => {
        if (toastTimeoutRef.current) return;

        setToastMessage(message);

        toastTimeoutRef.current = setTimeout(() => {
            setToastMessage(null);
            toastTimeoutRef.current = null;
        }, 1000);
    }, []);

    // Session Validation
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

    const syncStudentTags = useCallback(async (tags) => {
        await api.syncStudentTags(tags);
        const {data} = await api.getStudentProfile();
        setAppData(prev => ({...prev, studentProfile: data}));
    }, []);


    const updateVacancy = useCallback(async (id, data) => {
        try {
            // 1. Send the updated data to the Laravel backend
            const res = await api.updateVacancy(id, data);

            // 2. Update the specific vacancy in the React state so the dashboard refreshes
            setAppData(prev => ({
                ...prev,
                vacancies: prev.vacancies.map(v => v.id === id ? (res.data || res) : v)
            }));

            // 3. Send the user back to the dashboard
            navigate('/dashboard/bedrijf');
        } catch (error) {
            console.error("Fout bij updaten vacature:", error);
            alert("Er is iets misgegaan bij het opslaan van de wijzigingen.");
        }
    }, [navigate]);

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
        user, isAuthenticated, isLoading, ...appData,
        login: handleLogin,
        logout: handleLogout,
        updateCompanyStatus: handleUpdateCompanyStatus,
        syncStudentTags: handleSyncStudentTags,
        createStudentUser: api.createStudentUser,
        createStudentUser,
        students: appData.allStudents || [],
        vacancies: appData.vacancies || [],
        tags: appData.tags || [],
        studentProfile: appData.studentProfile,
        learningGoals: appData.learningGoals || [],
        saveLearningGoal,
        removeLearningGoal,
        addVacancy,
        deleteVacancy,
        updateVacancy,
        syncStudentTags
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
