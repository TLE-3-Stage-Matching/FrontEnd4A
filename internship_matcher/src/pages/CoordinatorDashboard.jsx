import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {AppContext} from '../context/AppContext';
import ToggleSwitch from '../components/ToggleSwitch';
import Pagination from '../components/Pagination';
import '../components/companydashboard.css';
import '../components/CreateVacancy.css';

const CoordinatorDashboard = () => {
    // --- CONTEXT ---
    const {
        isLoading,
        allCompanies,
        allStudents,
        logout,
        createStudentUser,
        updateCompanyStatus
    } = useContext(AppContext);

    // --- STATE for student form ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- STATE for pagination ---
    const [companyPage, setCompanyPage] = useState(1);
    const [studentPage, setStudentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // --- EFFECTS ---
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // --- HANDLERS ---
    const handleCompanyStatusToggle = (companyId, currentStatus) => {
        updateCompanyStatus(companyId, !currentStatus);
    };

    const handleCreateStudentSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        const payload = {role: "student", email, password, first_name: firstName, last_name: lastName};
        try {
            await createStudentUser(payload);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setSuccessMessage(`Student ${firstName} ${lastName} succesvol aangemaakt.`);
        } catch (error) {
            setSuccessMessage(`Fout: ${error.message}`);
        }
    };

    // --- PAGINATION LOGIC ---
    const safeAllCompanies = Array.isArray(allCompanies) ? allCompanies : [];
    const currentCompanies = safeAllCompanies.slice((companyPage - 1) * ITEMS_PER_PAGE, companyPage * ITEMS_PER_PAGE);
    const totalCompanyPages = Math.ceil(safeAllCompanies.length / ITEMS_PER_PAGE);

    const safeAllStudents = Array.isArray(allStudents) ? allStudents : [];
    const currentStudents = safeAllStudents.slice((studentPage - 1) * ITEMS_PER_PAGE, studentPage * ITEMS_PER_PAGE);
    const totalStudentPages = Math.ceil(safeAllStudents.length / ITEMS_PER_PAGE);

    // --- RENDER ---
    if (isLoading) {
        return <div className="dashboard-container"><h1>Dashboard wordt geladen...</h1></div>;
    }

    return (
        <div className="dashboard-container">
            <header className="header-row">
                <h1>Coördinator Dashboard</h1>
                <div className="header-actions">
                    <Link to="/profiel" className="btn-outline">Profiel</Link>
                    <button onClick={logout} className="btn-logout">Uitloggen</button>
                </div>
            </header>

            {successMessage && <div role="alert" className="success-banner">{successMessage}</div>}

            <div className="form-section">
                <h2>Bedrijven Beheren ({safeAllCompanies.length})</h2>
                <div className="management-list">
                    {currentCompanies.length > 0 ? currentCompanies.map(company => (
                        <div key={company.id} className="management-list-item">
                            <span><strong>{company.name}</strong><br/><small>{company.email || 'Geen email'}</small></span>
                            <ToggleSwitch checked={company.is_active}
                                          onChange={() => handleCompanyStatusToggle(company.id, company.is_active)}
                                          offLabel="Inactief" onLabel="Actief"/>
                        </div>
                    )) : <p>Er zijn nog geen bedrijven in het systeem.</p>}
                </div>
                <Pagination currentPage={companyPage} totalPages={totalCompanyPages} onPageChange={setCompanyPage}/>
            </div>

            <div className="form-section">
                <h2>Studenten Overzicht ({safeAllStudents.length})</h2>
                <div className="management-list">
                    {currentStudents.length > 0 ? currentStudents.map(student => (
                        <div key={student.id} className="management-list-item">
                            <span><strong>{student.first_name} {student.last_name}</strong><br/><small>{student.email}</small></span>
                            <Link to={`/coordinator/student/${student.id}/applications`} className="btn-outline btn-sm">Bekijk
                                Sollicitaties</Link>
                        </div>
                    )) : <p>Er zijn geen studenten in het systeem.</p>}
                </div>
                <Pagination currentPage={studentPage} totalPages={totalStudentPages} onPageChange={setStudentPage}/>
            </div>

            <div className="form-section">
                <h2>Nieuw Student Account Aanmaken</h2>
                <form onSubmit={handleCreateStudentSubmit}>
                    <div className="form-group"><label htmlFor="first_name">Voornaam</label><input type="text"
                                                                                                   id="first_name"
                                                                                                   value={firstName}
                                                                                                   onChange={(e) => setFirstName(e.target.value)}
                                                                                                   required/></div>
                    <div className="form-group"><label htmlFor="last_name">Achternaam</label><input type="text"
                                                                                                    id="last_name"
                                                                                                    value={lastName}
                                                                                                    onChange={(e) => setLastName(e.target.value)}
                                                                                                    required/></div>
                    <div className="form-group"><label htmlFor="email">E-mailadres</label><input type="email" id="email"
                                                                                                 value={email}
                                                                                                 onChange={(e) => setEmail(e.target.value)}
                                                                                                 required/></div>
                    <div className="form-group"><label htmlFor="password">Wachtwoord</label><input type="password"
                                                                                                   id="password"
                                                                                                   value={password}
                                                                                                   onChange={(e) => setPassword(e.target.value)}
                                                                                                   required
                                                                                                   minLength="8"/></div>
                    <button type="submit" className="btn-primary" style={{width: '100%'}}>Account Aanmaken</button>
                </form>
            </div>
        </div>
    );
};

export default CoordinatorDashboard;
