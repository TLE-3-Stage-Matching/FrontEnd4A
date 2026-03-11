import {useState} from "react";

const StudentOverzicht = () => {

    const mockStudents = [
        {
            "id": 1,
            "role": "student",
            "email": "alex.devries@example.com",
            "first_name": "Alex",
            "middle_name": "de",
            "last_name": "Vries",
            "phone": "+31612345678",
            "created_at": "2026-02-15T08:30:00+00:00",
            "updated_at": "2026-03-10T14:20:00+00:00",
            "student_profile": {
                "user_id": 1,
                "headline": "Frontend Developer (React/Vue)",
                "bio": "Ik ben een creatieve frontend student met een passie voor toegankelijke UI/UX.",
                "address_line": "Kerkstraat 42",
                "postal_code": "1017AB",
                "city": "Amsterdam",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": true,
                "exclude_location": false
            }
        },
        {
            "id": 2,
            "role": "student",
            "email": "s.alfarsi@example.com",
            "first_name": "Samira",
            "middle_name": null,
            "last_name": "Al-Farsi",
            "phone": null,
            "created_at": "2026-02-20T09:15:00+00:00",
            "updated_at": "2026-03-11T10:05:00+00:00",
            "student_profile": {
                "user_id": 2,
                "headline": "Fullstack Web Intern",
                "bio": "Gek op Node.js en databases. Ik zoek een stage waar ik de hele stack kan aanraken.",
                "address_line": "Weena 100",
                "postal_code": "3012BR",
                "city": "Rotterdam",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": false,
                "exclude_location": true
            }
        },
        {
            "id": 3,
            "role": "student",
            "email": "j.lee.dev@example.com",
            "first_name": "Jordan",
            "middle_name": null,
            "last_name": "Lee",
            "phone": "+31698765432",
            "created_at": "2026-01-10T11:45:00+00:00",
            "updated_at": "2026-03-05T09:30:00+00:00",
            "student_profile": {
                "user_id": 3,
                "headline": "Mobile App Developer",
                "bio": "Focus op React Native en iOS ontwikkeling. Beschikbaar vanaf september.",
                "address_line": "Oudegracht 210",
                "postal_code": "3511NR",
                "city": "Utrecht",
                "country": "Netherlands",
                "searching_status": "placed",
                "exclude_demographics": true,
                "exclude_location": true
            }
        },
        {
            "id": 4,
            "role": "student",
            "email": "emma.bakker99@example.com",
            "first_name": "Emma",
            "middle_name": null,
            "last_name": "Bakker",
            "phone": null,
            "created_at": "2026-03-01T14:22:00+00:00",
            "updated_at": "2026-03-09T16:10:00+00:00",
            "student_profile": {
                "user_id": 4,
                "headline": "Junior UX/UI Designer",
                "bio": "Ik vertaal complexe problemen naar simpele, strakke Figma designs.",
                "address_line": "Spuistraat 12",
                "postal_code": "2511BB",
                "city": "Den Haag",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": false,
                "exclude_location": false
            }
        },
        {
            "id": 5,
            "role": "student",
            "email": "l.jansen@example.com",
            "first_name": "Liam",
            "middle_name": null,
            "last_name": "Jansen",
            "phone": "+31623456789",
            "created_at": "2026-02-28T10:00:00+00:00",
            "updated_at": "2026-03-02T11:00:00+00:00",
            "student_profile": {
                "user_id": 5,
                "headline": "E-commerce IT Stagiair",
                "bio": "Ervaring met PHP en MySQL. Ik help graag met het optimaliseren van webshops.",
                "address_line": "Stratumseind 55",
                "postal_code": "5611ER",
                "city": "Eindhoven",
                "country": "Netherlands",
                "searching_status": "inactive",
                "exclude_demographics": false,
                "exclude_location": false
            }
        },
        {
            "id": 6,
            "role": "student",
            "email": "zoe.peters@example.com",
            "first_name": "Zoe",
            "middle_name": null,
            "last_name": "Peters",
            "phone": null,
            "created_at": "2026-03-05T13:15:00+00:00",
            "updated_at": "2026-03-10T09:45:00+00:00",
            "student_profile": {
                "user_id": 6,
                "headline": "Data Science Student",
                "bio": "Python liefhebber. Ik wil leren hoe ik machine learning modellen in productie kan draaien.",
                "address_line": "Zernikeplein 7",
                "postal_code": "9747AS",
                "city": "Groningen",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": true,
                "exclude_location": false
            }
        },
        {
            "id": 7,
            "role": "student",
            "email": "n.visser88@example.com",
            "first_name": "Noah",
            "middle_name": null,
            "last_name": "Visser",
            "phone": "+31687654321",
            "created_at": "2026-01-20T16:30:00+00:00",
            "updated_at": "2026-02-15T12:20:00+00:00",
            "student_profile": {
                "user_id": 7,
                "headline": "Backend Developer (C# / .NET)",
                "bio": "Sterk in logica en architectuur. Ik zoek een complexe backend uitdaging.",
                "address_line": "Grote Markt 1",
                "postal_code": "2011RD",
                "city": "Haarlem",
                "country": "Netherlands",
                "searching_status": "placed",
                "exclude_demographics": false,
                "exclude_location": false
            }
        },
        {
            "id": 8,
            "role": "student",
            "email": "m.smit@example.com",
            "first_name": "Mila",
            "middle_name": null,
            "last_name": "Smit",
            "phone": null,
            "created_at": "2026-03-08T09:00:00+00:00",
            "updated_at": "2026-03-11T08:15:00+00:00",
            "student_profile": {
                "user_id": 8,
                "headline": "Junior Cloud Engineer",
                "bio": "AWS gecertificeerd en klaar om infrastructuur te automatiseren met Terraform.",
                "address_line": "Plein 1944",
                "postal_code": "6511JD",
                "city": "Nijmegen",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": true,
                "exclude_location": true
            }
        },
        {
            "id": 9,
            "role": "student",
            "email": "lucas.vandijk@example.com",
            "first_name": "Lucas",
            "middle_name": "van",
            "last_name": "Dijk",
            "phone": "+31634567890",
            "created_at": "2026-02-10T14:00:00+00:00",
            "updated_at": "2026-03-01T10:30:00+00:00",
            "student_profile": {
                "user_id": 9,
                "headline": "Software Testing Stagiair",
                "bio": "Ik breek graag dingen zodat ze beter gebouwd kunnen worden. Bekend met Cypress en Jest.",
                "address_line": "Stationsplein 2",
                "postal_code": "7311NZ",
                "city": "Apeldoorn",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": false,
                "exclude_location": false
            }
        },
        {
            "id": 10,
            "role": "student",
            "email": "sophie.meijer@example.com",
            "first_name": "Sophie",
            "middle_name": null,
            "last_name": "Meijer",
            "phone": null,
            "created_at": "2026-03-09T11:20:00+00:00",
            "updated_at": "2026-03-10T15:40:00+00:00",
            "student_profile": {
                "user_id": 10,
                "headline": "Web Accessibility Specialist",
                "bio": "Passie voor WCAG! Ik wil bedrijven helpen hun websites voor iedereen bruikbaar te maken.",
                "address_line": "Vrijthof 10",
                "postal_code": "6211LC",
                "city": "Maastricht",
                "country": "Netherlands",
                "searching_status": "active",
                "exclude_demographics": true,
                "exclude_location": false
            }
        }
    ]

    const [searchTerm, setSearchTerm] = useState("");

    // Helper function to determine status badge style and text
    const getStatusInfo = (status) => {
        switch (status) {
            case 'active':
                return {text: 'Actief zoekend', bg: '#fef3c7', color: '#92400e'};
            case 'placed':
                return {text: 'Geplaatst', bg: '#d1fae5', color: '#065f46'};
            case 'inactive':
                return {text: 'Inactief', bg: '#e5e7eb', color: '#4b5563'};
            default:
                return {text: status, bg: '#e5e7eb', color: '#4b5563'};
        }
    };

    // 'zoeklijst'
    const filteredStudents = mockStudents.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{padding: '20px', maxWidth: '800px'}}>
            <h2>Studenten Overzicht</h2>


            <input
                type="text"
                placeholder="Zoek student op naam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}
            />

            {/* Student List using <ul> and <li> */}
            <ul style={{listStyle: 'none', padding: 0}}>
                {filteredStudents.map(student => {
                    const statusInfo = getStatusInfo(student.student_profile.searching_status);
                    return (
                        <li key={student.id}
                            style={{
                                padding: '15px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <div>
                                <strong style={{fontSize: '1.1em'}}>{student.first_name} {student.last_name}</strong>
                                <p style={{margin: '5px 0', color: '#666'}}>{student.student_profile.headline}</p>
                            </div>

                            <div style={{textAlign: 'right'}}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: statusInfo.bg,
                                    color: statusInfo.color,
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {statusInfo.text}
                                </span>
                                <p style={{fontSize: '12px', marginTop: '5px'}}>Matches: {(student.id % 5) + 2}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {filteredStudents.length === 0 && (
                <p>Geen studenten gevonden voor "{searchTerm}"</p>
            )}
        </div>
    );
};

export default StudentOverzicht;