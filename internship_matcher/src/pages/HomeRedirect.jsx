import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContext} from '../context/AppContext';

// This component's only job is to redirect the user to the correct
// dashboard after they have been authenticated.
const HomeRedirect = () => {
    const {user, isLoading} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            // Wait until the session has been validated
            return;
        }

        if (user) {
            console.log(`User found, redirecting to /dashboard/${user.role}`);
            if (user.role === 'student') {
                navigate('/dashboard/student');
            } else if (user.role === 'company') {
                navigate('/dashboard/bedrijf');
            } else if (user.role === 'coordinator') {
                navigate('/dashboard/coordinator');
            }
        } else {
            // If for some reason we land here without a user, go to login
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    // Render a loading state while the redirect is happening
    return <div>Aan het doorsturen...</div>;
};

export default HomeRedirect;
