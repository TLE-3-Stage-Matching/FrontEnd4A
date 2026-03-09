import {useState} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate, Link} from "react-router-dom";
import {AppContext} from './context/AppContext';
import Home from "./pages/Home.jsx";
import CompanyDashboard from "./pages/company_dashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import Profile from "./pages/Profile.jsx"; // The new profile page
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import './App.css';

// --- Hardcoded Data ---
const initialVacancies = [
    {
        id: 1,
        title: 'Frontend Developer Stagiair',
        applications: 12,
        matches: 8,
        skills: [{id: 1, name: 'React', type: 'must'}]
    },
    {id: 2, title: 'UX/UI Design Stage', applications: 5, matches: 5, skills: [{id: 1, name: 'Figma', type: 'must'}]},
    {
        id: 3,
        title: 'Backend Developer Stage',
        applications: 2,
        matches: 1,
        skills: [{id: 1, name: 'Node.js', type: 'must'}]
    },
];


// --- Layout Component ---
// This component now holds all the state and logic. She's the brain.
const Layout = () => {
    const [vacancies, setVacancies] = useState(initialVacancies);
    const [nextId, setNextId] = useState(4);
    const [userRole, setUserRole] = useState(null); // No one is logged in initially.
    const navigate = useNavigate();

    // --- Handlers ---
    const handleAddVacancy = (vacancyData) => {
        const newVacancy = {...vacancyData, id: nextId, applications: 0, matches: 0};
        setVacancies([...vacancies, newVacancy]);
        setNextId(nextId + 1);
        navigate('/dashboard/bedrijf');
    };

    const handleUpdateVacancy = (updatedVacancy) => {
        setVacancies(vacancies.map(v => v.id === updatedVacancy.id ? updatedVacancy : v));
        navigate('/dashboard/bedrijf');
    };

    const handleDeleteVacancy = (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this vacancy?')) {
            setVacancies(vacancies.filter(v => v.id !== idToDelete));
        }
    };

    // This function will serve for both "logout" and "delete profile" for now.
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to delete your profile and log out?')) {
            setUserRole(null);
            navigate('/'); // Go back to the home/login screen.
        }
    };

    const contextValue = {
        vacancies,
        addVacancy: handleAddVacancy,
        updateVacancy: handleUpdateVacancy,
        deleteVacancy: handleDeleteVacancy,
        userRole,
        setUserRole,
        logout: handleLogout
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
                {path: "/", element: <Home/>},
                {path: "/dashboard/bedrijf", element: <CompanyDashboard/>},
                {path: "/dashboard/student", element: <StudentDashboard/>},
                {path: "/dashboard/coordinator", element: <CoordinatorDashboard/>},
                {path: "/profiel", element: <Profile/>},
                {path: "/vacature/nieuw", element: <CreateVacancy/>},
                {path: "/vacature/bewerken/:id", element: <CreateVacancy/>},
            ]
        }
    ]);

    return (
        <RouterProvider router={router}/>
    );
}

export default App;
