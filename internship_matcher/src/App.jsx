import {useState} from 'react';
import Login from './components/Login';
import './App.css';
import CompanyDashboard from "./pages/company_dashboard.jsx";
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Home from "./pages/Home.jsx";

const Layout = () => {
    return (
        <>
            <Outlet/>
        </>
    );
};

function App() {

    const router = createBrowserRouter([
        {
            element: <Layout/>,
            children: [
                {
                    path: "/",
                    element: <Home/>,
                },
                {
                    path: "/companydashboard",
                    element: <CompanyDashboard/>,
                },

            ]
        }
    ]);

    return (
        <RouterProvider router={router}/>
    );
}


export default App;