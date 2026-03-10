import {useState, useEffect} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate, Link} from "react-router-dom";
import {AppContext} from './context/AppContext';
import * as mockApi from './api/mockApi'; // Import the mock API

// --- Component Imports ---
import Home from "./pages/Home.jsx";
import CompanyDashboard from "./pages/company_dashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import Profile from "./pages/Profile.jsx";
import StudentResult from "./pages/StudentResult.jsx";
import StudentOnboarding from "./pages/StudentOnboarding.jsx";
import './App.css';
import DetailTestButton from "./pages/DetailTestButton.jsx";
import matchesDetails from "./components/MatchesDetails.jsx";
import MatchesDetails from "./components/MatchesDetails.jsx";


// --- Brain/Layout Component ---
const Layout = () => {
    // --- State ---
    const [user, setUser] = useState(null); // Full user object, null if not logged in
    const [vacancies, setVacancies] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // --- Effects ---
    // Initial data fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            console.log("App loading, fetching initial data...");
            try {
                const [fetchedVacancies, fetchedTags] = await Promise.all([
                    mockApi.getVacancies(),
                    mockApi.getTags(),
                ]);
                setVacancies(fetchedVacancies);
                setTags(fetchedTags);
                console.log("Initial data fetched successfully.");
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // --- Handlers ---
    const handleLogin = async (role) => {
        console.log(`Attempting to log in as: ${role}`);
        const loggedInUser = await mockApi.loginAndGetUser(role);
        setUser(loggedInUser);
        console.log("User logged in:", loggedInUser);
    };

    const handleLogout = () => {
        if (window.confirm('Weet je zeker dat je wilt uitloggen/je profiel wilt verwijderen?')) {
            console.log("User logged out.");
            setUser(null);
            navigate('/');
        }
    };

    // Vacancy Handlers
    const addVacancy = async (vacancyData) => {
        const newVacancy = await mockApi.createVacancy(vacancyData);
        setVacancies(prevVacancies => [...prevVacancies, newVacancy]);
        navigate('/dashboard/bedrijf');
    };

    const updateVacancy = async (updatedVacancy) => {
        const returnedVacancy = await mockApi.updateVacancy(updatedVacancy);
        setVacancies(vacancies.map(v => v.id === returnedVacancy.id ? returnedVacancy : v));
        navigate('/dashboard/bedrijf');
    };

    const deleteVacancy = async (idToDelete) => {
        if (window.confirm('Weet je zeker dat je deze vacature wilt verwijderen?')) {
            await mockApi.deleteVacancy(idToDelete);
            setVacancies(vacancies.filter(v => v.id !== idToDelete));
        }
    };

    // Student Handlers
    const syncStudentTags = async (tagsPayload) => {
        await mockApi.syncStudentTags({tags: tagsPayload});
        // In a real app, we might want to update a local user profile state
        console.log("Student tags synced via context handler.");
    };

    // Coordinator Handlers
    const createStudentUser = async (studentData) => {
        await mockApi.createStudentUser(studentData);
        // In a real app, we might want to re-fetch the list of users
        console.log("Student user created via context handler.");
    };

    // --- Context Value ---
    const contextValue = {
        user,
        userRole: user ? user.role : null,
        login: handleLogin,
        logout: handleLogout,

        vacancies,
        addVacancy,
        updateVacancy,
        deleteVacancy,

        tags,
        syncStudentTags,
        createStudentUser,
        isLoading,
    };

    return (
        <AppContext.Provider value={contextValue}>
            <Outlet/>
        </AppContext.Provider>
    );
};


// --- Main App & Router ---
function App() {
    // Note: The placeholder components for Student/Coordinator dashboards are removed
    // as we now have dedicated files for them.
    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {path: "/", element: <Home/>},
                {path: "/profiel", element: <Profile/>},
                {path: "/onboarding/student", element: <StudentOnboarding/>},
                {path: "/dashboard/bedrijf", element: <CompanyDashboard/>},
                {path: "/dashboard/student", element: <StudentDashboard/>},
                {path: "/dashboard/coordinator", element: <CoordinatorDashboard/>},
                {path: "/vacature/nieuw", element: <CreateVacancy/>},
                {path: "/vacature/bewerken/:id", element: <CreateVacancy/>},

                //student
                {path: "resultaten", element: <StudentResult/>},

                //details
                {path: "/DetailsTest", element: <DetailTestButton/>},
                {path: "matchesdetails", element: <MatchesDetails/>}
            ]
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;
