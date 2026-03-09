import {useState} from 'react';
import Login from './components/Login';
import './App.css';
import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Home from "./pages/Home.jsx";
import RegistrationForm from './components/Student_register.jsx';

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
                {path: "/", element: <Home/>},
                {path: "/student_register", element: <RegistrationForm/>},
            ]
        }
    ]);

    return <RouterProvider router={router}/>;
}

export default App;