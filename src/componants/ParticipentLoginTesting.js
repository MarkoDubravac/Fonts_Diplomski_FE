import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getSurveySessionToken, request } from '../axios_helper';
import { useNavigate, useParams } from 'react-router-dom';

const ParticipantLoginTest = ({ surveyId }) => {
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [responses, setResponses] = useState({});
    const [warnings, setWarnings] = useState({});
    const [error, setError] = useState(null);
    const { uuid } = useParams();

    // Fetch the survey data
    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await request("GET", `/${surveyId}`);
                setSurvey(response.data);
            } catch (error) {
                console.error("Error fetching survey:", error);
                setError(error);
            }
        };

        fetchSurvey();
    }, [surveyId]);

    // Handle input changes
    const handleChange = (questionId, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [questionId]: value,
        }));
        // Remove the warning for the question once it's filled
        setWarnings((prevWarnings) => ({
            ...prevWarnings,
            [questionId]: false,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newWarnings = {};

        survey.questions.forEach((question) => {
            if (!question.optional && !responses[question.id]) {
                newWarnings[question.id] = true;
            }
        });

        setWarnings(newWarnings);

        if (Object.keys(newWarnings).length > 0) {
            return;
        }

        const answers = Object.keys(responses).map((questionId) => ({
            questionId: parseInt(questionId),
            responseText: Array.isArray(responses[questionId])
                ? JSON.stringify(responses[questionId])
                : responses[questionId],
        }));

        const surveyResponseDTO = {
            surveyId: survey.id,
            surveySession: getSurveySessionToken(),
            answers,
        };

        try {
            await request("POST", "/responses", surveyResponseDTO);
            navigate(`/${uuid}/home`);
        } catch (error) {
            setError(error);
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!survey) {
        return <div>Loading...</div>;
    }

    return (
        <div className="row mb-3 p-3">
            <div className="container d-grid" style={{ placeItems: "center" }}>
                <Card className="col-sm-6">
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <h1>{survey.title}</h1>
                            <p>{survey.description}</p>
                            {survey.questions.map((question) => (
                                <Form.Group className="mb-3" key={question.id}>
                                    <Form.Label>{question.text}</Form.Label>
                                    {question.optional === false && (
                                        <span style={{ color: 'red' }}> *</span>
                                    )}

                                    {question.type === 'TEXT' && (
                                        <Form.Control
                                            type="text"
                                            onChange={(e) => handleChange(question.id, e.target.value)}
                                            isInvalid={warnings[question.id]}
                                        />
                                    )}
                                    {question.type === 'NUMBER' && (
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            onChange={(e) => handleChange(question.id, e.target.value)}
                                            isInvalid={warnings[question.id]}
                                        />
                                    )}
                                    {question.type === 'RADIO' && question.options.map((option) => (
                                        <Form.Check
                                            type="radio"
                                            name={question.id}
                                            key={option}
                                            label={option}
                                            value={option}
                                            onChange={() => handleChange(question.id, option)}
                                            isInvalid={warnings[question.id]}
                                        />
                                    ))}
                                    {question.type === 'CHECKBOX' && question.options.map((option) => (
                                        <Form.Check
                                            type="checkbox"
                                            key={option}
                                            label={option}
                                            value={option}
                                            onChange={(e) => {
                                                const updatedValues = responses[question.id] || [];
                                                if (e.target.checked) {
                                                    updatedValues.push(option);
                                                } else {
                                                    const index = updatedValues.indexOf(option);
                                                    updatedValues.splice(index, 1);
                                                }
                                                handleChange(question.id, updatedValues);
                                            }}
                                            isInvalid={warnings[question.id]}
                                        />
                                    ))}
                                    {warnings[question.id] && (
                                        <Form.Control.Feedback type="invalid">
                                            This field is required.
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                            ))}
                            <div className="text-end">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default ParticipantLoginTest;
