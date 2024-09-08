import React, {useEffect, useState} from 'react';
import {request} from "../../axios_helper";
import Card from 'react-bootstrap/Card';
import surveyImage from "../../survey.svg";
import collectionImage from "../../collection.svg";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function AllAdminSurveys() {
    const [surveys, setSurveys] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [textCollections, setTextCollections] = useState(null);
    const [selectedCollectionTexts, setSelectedCollectionTexts] = useState({});
    const [visibleCollections, setVisibleCollections] = useState({});
    const [loadingTexts, setLoadingTexts] = useState(false);

    let currentUrl = window.location.href;
    let newUrl = currentUrl.replace("/admin", "");

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await request("GET", `/admin`);
                setSurveys(response.data);
            } catch (error) {
                console.error("Error fetching survey:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    useEffect(() => {
        request("GET", "/admin/getTextCollections")
            .then((response) => {
                setTextCollections(response.data);
            })
            .catch((error) => {
                console.error("Error fetching text collection: ", error);
            });
    }, []);

    const handleDeleteSurvey = async (id) => {
        try {
            await request("DELETE", `/admin?id=${id}`);
            setSurveys((prevSurveys) => prevSurveys.filter(survey => survey.id !== id));
        } catch (error) {
            console.error("Error deleting survey:", error);
        }
    };

    const handleDeleteTextCollection = async (id) => {
        try {
            await request("DELETE", `/admin/deleteTextCollection?id=${id}`);
            setTextCollections((prevCollections) => prevCollections.filter(collection => collection.id !== id));
        } catch (error) {
            console.error("Error deleting text collection:", error);
        }
    };

    const handleLookCollection = async (id) => {
        if (visibleCollections[id]) {
            // Toggle off
            setVisibleCollections(prev => ({...prev, [id]: false}));
            setSelectedCollectionTexts(prevTexts => {
                const updatedTexts = {...prevTexts};
                delete updatedTexts[id];
                return updatedTexts;
            });
        } else {
            // Toggle on
            setLoadingTexts(true);
            try {
                const response = await request("GET", `/admin/getCollectionTexts?id=${id}`);
                setSelectedCollectionTexts(prevTexts => ({...prevTexts, [id]: response.data}));
                setVisibleCollections(prev => ({...prev, [id]: true}));
            } catch (error) {
                console.error("Error fetching collection texts:", error);
            } finally {
                setLoadingTexts(false);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="d-flex flex-column align-items-center mt-3">
            {surveys && surveys.length > 0 ? (
                <ul className="w-100 me-3">
                    <h5 className="mb-3">Ankete</h5>
                    {surveys.map((survey, index) => (
                        <Card className="mb-3" key={index}>
                            <li className="list-unstyled m-3">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <img src={surveyImage} alt="survey" className="me-3" />
                                        <span>{survey.title} - {survey.uuid}</span>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row align-items-sm-center mt-3 mt-sm-0">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleDeleteSurvey(survey.id)}
                                        >
                                            Obriši
                                        </Button>
                                        <Form.Control
                                            type="text"
                                            value={`${newUrl}/${survey.uuid}`}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </li>
                        </Card>
                    ))}
                </ul>
            ) : (
                <div className="mb-3">Nemate Kreiranih Aneketa.</div>
            )}
            {textCollections && textCollections.length > 0 ? (
                <ul className="w-100 me-3">
                    <h5 className="mb-3">Kolekcije</h5>
                    {textCollections.map((collection, index) => (
                        <Card className="mb-3" key={index}>
                            <li className="list-unstyled m-3 d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <img src={collectionImage} alt="collection" className="me-3" />
                                    <span>{collection.name}</span>
                                </div>
                                <div className="d-flex">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDeleteTextCollection(collection.id)}
                                    >
                                        Obriši
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleLookCollection(collection.id)}
                                    >
                                        {visibleCollections[collection.id] ? "Zatvori tekstove" : "Prikaži tekstove"}
                                    </Button>
                                </div>
                            </li>
                            {visibleCollections[collection.id] && selectedCollectionTexts[collection.id] && (
                                <div className="w-100">
                                    {selectedCollectionTexts[collection.id].map((text, idx) => (
                                        <textarea
                                            key={idx}
                                            value={text}
                                            readOnly
                                            className="form-control mb-2"
                                            rows="3"
                                        />
                                    ))}
                                </div>
                            )}
                            {loadingTexts && <div>Loading texts...</div>}
                        </Card>
                    ))}
                </ul>
            ) : (
                <div>Nemate kreiranih kolekcija.</div>
            )}
        </div>
    );
}
