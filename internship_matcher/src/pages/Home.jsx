import {useState} from 'react';
import Login from '../components/Login';
import '../App.css';

// These are just placeholder dashboards, the real tea will be served later
const StudentDashboard = () => <div><h2>Student Dashboard</h2><p>Welcome, future icon!</p></div>;
const CompanyDashboard = () => <div><h2>Company Dashboard</h2><p>Get ready to scout some talent, boss!</p></div>;
const CoordinatorDashboard = () => <div><h2>Coordinator Dashboard</h2><p>You're the main character today,
    coordinator!</p></div>;

function Home() {
    // State management, but make it fashion. Keeping track of who's who.
    const [userRole, setUserRole] = useState(null); // null means no one is logged in, tragic.

    // This is the moment! When the login is a success, we set the role.
    const handleLogin = (role) => {
        setUserRole(role);
    };

    // A little logout function to keep things fresh.
    const handleLogout = () => {
        setUserRole(null);
    };

    // Time to serve some conditional rendering realness.
    const renderContent = () => {
        if (!userRole) {
            // If no one's logged in, show them the door... to the login page.
            return <Login onLogin={handleLogin}/>;
        }

        // Based on the role, we serve a different look (dashboard).
        switch (userRole) {
            case 'student':
                return <StudentDashboard/>;
            case 'company':
                return <CompanyDashboard/>;
            case 'coordinator':
                return <CoordinatorDashboard/>;
            default:
                // This should never happen, but if it does, we're prepared.
                return <Login onLogin={handleLogin}/>;
        }
    };

    return (
        <>
            <header style={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc'
            }}>
                <h1>Internship Matcher</h1>
                {/* If a user is logged in, give them a way out. */}
                {userRole && <button onClick={handleLogout}>Logout</button>}
            </header>
            <main style={{padding: '2rem'}}>
                {renderContent()}
            </main>
        </>
    );
}


export default Home;