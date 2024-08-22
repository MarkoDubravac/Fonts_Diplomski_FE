import React, { useEffect, useState } from 'react';
import { request } from "../../axios_helper";
import Card from 'react-bootstrap/Card';
import surveyImage from "../../survey.svg";
import collectionImage from "../../collection.svg";
import Button from 'react-bootstrap/Button';

export default function AllAdminSurveys() {
    const [surveys, setSurveys] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [textCollections, setTextCollections] = useState(null);
    let currentUrl = window.location.href;
    let newUrl = currentUrl.replace("/admin", "");

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await request("GET", `/`);
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
        request("GET", "/getTextCollections")
            .then((response) => {
                //const textCollectionsData = response.data.map((item) => {item.name});
                setTextCollections(response.data);
                //console.log(textCollectionsData);
            })
            .catch((error) => {
                console.error("Error fetching text collection: ", error);
            });
    }, []);

    const handleDeleteSurvey = async (id) => {
        try {
            await request("DELETE", `/deleteSurvey`, { params: { id } });
            setSurveys((prevSurveys) => prevSurveys.filter(survey => survey.id !== id));
        } catch (error) {
            console.error("Error deleting survey:", error);
        }
    };

    const handleDeleteTextCollection = async (id) => {
        try {
            await request("DELETE", `/deleteTextCollection?id=` + id);
            setTextCollections((prevCollections) => prevCollections.filter(collection => collection.id !== id));
        } catch (error) {
            console.error("Error deleting text collection:", error);
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
                <ul className="w-75">
                    <h5 className="mb-3">Surveys</h5>
                    {surveys.map((survey, index) => (
                        <Card className="mb-3" key={index}>
                            <li className="list-unstyled m-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={surveyImage} alt="survey" className="me-3"/>
                                    <span>{survey.title} - {survey.uuid}</span>
                                </div>
                                <div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDeleteSurvey(survey.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button variant="success" title={`${newUrl}/${survey.uuid}`} size="sm" onClick={() => navigator.clipboard.writeText(`${newUrl}/${survey.uuid}`)}>
                                        Copy Link
                                    </Button>
                                </div>
                            </li>
                        </Card>
                    ))}
                </ul>
            ) : (
                <div>No surveys available.</div>
            )}
            {textCollections && textCollections.length > 0 ? (
                <ul className="w-75">
                    <h5 className="mb-3">Collections</h5>
                    {textCollections.map((collection, index) => (
                        <Card className="mb-3" key={index}>
                            <li className="list-unstyled m-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img src={collectionImage} alt="collection" className="me-3"/>
                                    <span>{collection.name}</span>
                                </div>
                                <div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleDeleteTextCollection(collection.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        </Card>
                    ))}
                </ul>
            ) : (
                <div>No Collections available.</div>
            )}
        </div>
    );
}
