import {useState} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate} from "react-router-dom";
import {AppContext} from './context/AppContext';
import './App.css';

// --- Component Imports ---
import Home from "./pages/Home.jsx";
import Login from './components/Login';
import RegistrationForm from './pages/StudentRegister.jsx';
import CompanyDashboard from "./pages/company_dashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CoordinatorDashboard from "./pages/CoordinatorDashboard.jsx";
import CreateVacancy from "./pages/CreateVacancy.jsx";
import Profile from "./pages/Profile.jsx";
import StudentResult from "./pages/StudentResult.jsx";


// --- Hardcoded Initial Data ---
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

// --- Brain/Layout Component ---
const Layout = () => {
    const [vacancies, setVacancies] = useState(initialVacancies);
    const [nextId, setNextId] = useState(4);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // --- Handlers (Functionality from both files) ---

    const handleLogin = (role) => {
        console.log(`Succesvol ingelogd als: ${role}`);
        setUserRole(role);
        // Navigate based on role if needed
    };

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

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            setUserRole(null);
            navigate('/');
        }
    };

    const contextValue = {
        vacancies,
        addVacancy: handleAddVacancy,
        updateVacancy: handleUpdateVacancy,
        deleteVacancy: handleDeleteVacancy,
        userRole,
        setUserRole,
        logout: handleLogout,
        onLogin: handleLogin // Passing the login handler into context
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
                // General Routes
                {path: "/", element: <Home/>},
                {path: "/login", element: <Login/>},
                {path: "/student_register", element: <RegistrationForm/>},
                {path: "/profiel", element: <Profile/>},

                // Dashboard Routes
                {path: "/dashboard/bedrijf", element: <CompanyDashboard/>},
                {path: "/dashboard/student", element: <StudentDashboard/>},
                {path: "/dashboard/coordinator", element: <CoordinatorDashboard/>},

                // Vacancy/Match Routes
                {path: "/vacature/nieuw", element: <CreateVacancy/>},
                {path: "/vacature/bewerken/:id", element: <CreateVacancy/>},

                //student
                {path: "Resultaten", element: <StudentResult/>},
            ]
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;