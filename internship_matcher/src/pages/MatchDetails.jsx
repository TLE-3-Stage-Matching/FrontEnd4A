import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import * as api from '../api/client';

const MatchDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [detailData, setDetailData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const [vacancyRes, detailRes] = await Promise.all([
                    api.getStudentVacancy(id),
                    api.getStudentVacancyDetail(id)
                ]);


                setDetailData({
                    ...detailRes.data,
                    vacancy: vacancyRes.data.vacancy
                });
            } catch (error) {
                console.error("Fout bij ophalen vacature details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleApply = async () => {
        setIsApplying(true);
        try {
            // Using the match-choices endpoint to apply
            await api.applyForVacancy(id, "Ik ben erg geïnteresseerd in deze positie!");
            setApplySuccess(true);
            alert("Succesvol gesolliciteerd! Het bedrijf heeft je match-verzoek ontvangen.");
            navigate('/dashboard/student');
        } catch (error) {
            console.error("Fout bij solliciteren:", error);
            alert("Er is iets misgegaan, of je hebt al gesolliciteerd op deze vacature.");
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) return <div style={{padding: '40px', textAlign: 'center'}}>Laden...</div>;
    if (!detailData) return <div style={{padding: '40px', textAlign: 'center'}}>Vacature niet gevonden.</div>;

    const {vacancy, score, human_explanation, must_have_misses, nice_to_have_misses} = detailData;

    return (
        <div style={{maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif'}}>
            <button
                onClick={() => navigate(-1)}
                style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '20px'}}
            >
                ← Terug
            </button>

            <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>

                {/* Header Section */}
                <h1 style={{margin: '0 0 5px 0', fontSize: '24px'}}>{vacancy.title}</h1>
                <p style={{
                    margin: '0 0 20px 0',
                    color: '#666',
                    fontSize: '14px'
                }}>{vacancy.company.name || vacancy.company}</p>

                {/* Progress Bar */}
                <div style={{
                    background: '#F3F4F6',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{flex: 1, marginRight: '20px'}}>
                        <div style={{fontSize: '12px', color: '#4B5563', marginBottom: '8px'}}>Match score</div>
                        <div style={{
                            background: '#E5E7EB',
                            height: '8px',
                            borderRadius: '4px',
                            width: '100%',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                background: score >= 75 ? '#9a5b86' : '#e9bf5d',
                                height: '100%',
                                width: `${score}%`
                            }}></div>
                        </div>
                    </div>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#090808'}}>{score}%</div>
                </div>

                {/* Impact Cards (Generated dynamically from API explanation) */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px'}}>

                    {/* Positive Impacts */}
                    {human_explanation?.what_you_match_well?.map((item, index) => (
                        <div key={`pos-${index}`} style={{
                            background: '#E5E7EB',
                            borderRadius: '8px',
                            padding: '15px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                background: '#9a5b86'
                            }}></div>
                            <strong style={{fontSize: '13px', display: 'block', color: '#374151'}}>Sterke Match</strong>
                            <span style={{fontSize: '14px', color: '#4B5563'}}>Je hebt ervaring met: {item}</span>
                        </div>
                    ))}

                    {/* Negative Impacts (Misses) */}
                    {must_have_misses?.map((miss, index) => (
                        <div key={`miss-mh-${index}`} style={{
                            background: '#E5E7EB',
                            borderRadius: '8px',
                            padding: '15px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                background: '#EF4444'
                            }}></div>
                            <strong style={{fontSize: '13px', display: 'block', color: '#374151'}}>Ontbrekende Eis
                                (Must-have)</strong>
                            <span style={{
                                fontSize: '14px',
                                color: '#4B5563'
                            }}>Je mist de vaardigheid: {miss.tag_name}</span>
                        </div>
                    ))}

                    {nice_to_have_misses?.map((miss, index) => (
                        <div key={`miss-nth-${index}`} style={{
                            background: '#E5E7EB',
                            borderRadius: '8px',
                            padding: '15px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                background: '#e9bf5d'
                            }}></div>
                            <strong style={{fontSize: '13px', display: 'block', color: '#374151'}}>Ontbrekend
                                (Nice-to-have)</strong>
                            <span style={{
                                fontSize: '14px',
                                color: '#4B5563'
                            }}>Je mist de vaardigheid: {miss.tag_name}</span>
                        </div>
                    ))}
                </div>

                {/* Job Description */}
                <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Over de Stage</h3>
                <p style={{fontSize: '14px', color: '#4B5563', lineHeight: '1.6', marginBottom: '30px'}}>
                    {vacancy.description || "Geen beschrijving beschikbaar."}
                </p>

                {/* Skills Layout */}
                <div style={{display: 'flex', gap: '40px', marginBottom: '40px'}}>
                    <div style={{flex: 1}}>
                        <h4 style={{fontSize: '14px', marginBottom: '10px'}}>Vereist (Must-haves):</h4>
                        <ul style={{fontSize: '13px', color: '#4B5563', paddingLeft: '20px', margin: 0}}>
                            {/* Filter for importance >= 2 OR explicitly 'must_have' */}
                            {vacancy.vacancy_requirements?.filter(req => req.importance >= 2 || req.requirement_type === 'must_have').length > 0 ? (
                                vacancy.vacancy_requirements
                                    .filter(req => req.importance >= 2 || req.requirement_type === 'must_have')
                                    .map(req => (
                                        <li key={req.tag_id}>{req.tag.name}</li>
                                    ))
                            ) : (
                                <li style={{listStyleType: 'none', marginLeft: '-20px', color: '#9CA3AF'}}>Geen eisen
                                    opgegeven</li>
                            )}
                        </ul>
                    </div>
                    <div style={{flex: 1}}>
                        <h4 style={{fontSize: '14px', marginBottom: '10px'}}>Nice-to-have:</h4>
                        <ul style={{fontSize: '13px', color: '#0f1d21', paddingLeft: '20px', margin: 0}}>
                            {/* Filter for importance === 1 OR explicitly 'nice_to_have' */}
                            {vacancy.vacancy_requirements?.filter(req => req.importance === 1 || req.requirement_type === 'nice_to_have').length > 0 ? (
                                vacancy.vacancy_requirements
                                    .filter(req => req.importance === 1 || req.requirement_type === 'nice_to_have')
                                    .map(req => (
                                        <li key={req.tag_id}>{req.tag.name}</li>
                                    ))
                            ) : (
                                <li style={{listStyleType: 'none', marginLeft: '-20px', color: '#9ca3af'}}>Geen extra's
                                    gevraagd</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Apply Button */}
                <button
                    onClick={handleApply}
                    disabled={isApplying || applySuccess}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: applySuccess ? '#22C55E' : '#51294c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: (isApplying || applySuccess) ? 'not-allowed' : 'pointer',
                        transition: 'background 0.3s'
                    }}
                >

                    {isApplying ? 'Bezig met solliciteren...' : applySuccess ? 'Gesolliciteerd ✓' : 'Solliciteren'}
                </button>

            </div>
        </div>
    );
};

export default MatchDetails;