import {useState} from 'react';
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import './App.css';

// Component Imports
import Home from "./pages/Home.jsx";
import Login from './components/Login';
import RegistrationForm from './pages/StudentRegister.jsx';
import CompanyDashboard from './pages/CompanyDashboard.jsx';
import MatchDetails from './pages/MatchDetails.jsx';

const Layout = () => {
    return (
        <>
            <Outlet/>
        </>
    );
};

function App() {
    // Mock functie om props tevreden te houden voor Login
    const handleLogin = (role) => {
        console.log(`Succesvol ingelogd als: ${role}`);
        // In de toekomst kun je hier navigeren, bijv: window.location.href = '/company_dashboard';
    };

    // Mock functie voor het dashboard
    const handleViewChange = (view) => {
        console.log(`Dashboard view veranderd naar: ${view}`);
    };

    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {
                    path: "/",
                    element: <Home/>
                },
                {
                    path: "/login",
                    element: <Login onLogin={handleLogin}/>
                },
                {
                    path: "/student_register",
                    element: <RegistrationForm/>
                },
                {
                    path: "/company_dashboard",
                    element: <CompanyDashboard onViewChange={handleViewChange}/>
                },
                {
                    path: "/match_details",
                    element: <MatchDetails></MatchDetails>
                }
            ]
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;