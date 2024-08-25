import React, {useEffect, useState} from "react";
import {request} from "../../axios_helper";

export default function NewAdminSurvey() {
    const [surveyTitle, setSurveyTitle] = useState({value: "", error: false});
    const [questions, setQuestions] = useState([
        {
            question: "",
            type: "text",
            optional: false,
            options: [""],
            error: false,
            optionError: false,
        },
    ]);
    const [questionError, setQuestionError] = useState(false);
    const [textCollections, setTextCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");

    const handleQuestionChange = (index, event) => {
        const {name, value, type, checked} = event.target;
        const newQuestions = [...questions];
        const question = newQuestions[index];

        question[name] = type === "checkbox" ? checked : value;

        if (name === "type") {
            if (value !== "checkbox" && value !== "radio") {
                question.options = [""];
            } else if (question.options.length === 0) {
                question.options = [""];
            }
        }

        question.error = false; // Reset error on change
        setQuestions(newQuestions);
        setQuestionError(false); // Reset the question count error if a question is edited
    };

    const handleTitleChange = (event) => {
        setSurveyTitle({value: event.target.value, error: false});
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {question: "", type: "text", optional: false, options: [""], error: false, optionError: false},
        ]);
        setQuestionError(false);
    };

    const deleteQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        if (newQuestions.length === 0) {
            setQuestionError(true);
        }
    };

    const handleSurveySubmit = () => {
        let isValid = true;

        if (!surveyTitle.value.trim()) {
            setSurveyTitle({...surveyTitle, error: true});
            isValid = false;
        }

        if (questions.length === 0) {
            setQuestionError(true);
            isValid = false;
        }

        const newQuestions = questions.map((q) => {
            if (!q.question.trim()) {
                isValid = false;
                return {...q, error: true};
            }

            if (
                (q.type === "checkbox" || q.type === "radio") &&
                q.options.every((opt) => !opt.trim())
            ) {
                isValid = false;
                return {...q, optionError: true};
            }

            return {...q, error: false, optionError: false};
        });

        setQuestions(newQuestions);

        if (!isValid) {
            return;
        }

        const surveyData = {
            title: surveyTitle.value,
            collectionName: selectedCollection,
            questions: newQuestions.map((q) => ({
                text: q.question,
                type: q.type.toUpperCase(),
                optional: q.optional,
                options: q.options.filter((opt) => opt.trim()),
            })),
        };

        request("POST", "/admin/createSurvey", surveyData)
            .then((response) => {
                alert(`Survey created successfully; surveyId: ${response.data.uuid}`)
            })
            .catch((error) => {
                console.error("Error creating survey:", error);
            });
    };

    useEffect(() => {
        request("GET", "/admin/getTextCollections")
            .then((response) => {
                const textCollectionsData = response.data.map((item) => item.name);
                setTextCollections(textCollectionsData);
            })
            .catch((error) => {
                console.error("Error fetching text collection: ", error);
            });
    }, []);

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = event.target.value;
        newQuestions[questionIndex].optionError = false;
        setQuestions(newQuestions);
    };

    const addOption = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.push("");
        newQuestions[questionIndex].optionError = false;
        setQuestions(newQuestions);
    };

    const deleteOption = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.splice(optionIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSelectChange = (e) => {
        setSelectedCollection(e.target.value);
    };

    return (
        <div className="container mt-4">
            <h5 className="mb-3">Napravi anketu</h5>
            <div className="mb-3">
                <input
                    type="text"
                    value={surveyTitle.value}
                    onChange={handleTitleChange}
                    className={`form-control ${surveyTitle.error ? "is-invalid" : ""}`}
                    placeholder="Unesi naslov"
                />
                {surveyTitle.error && (
                    <div className="invalid-feedback">Naslov ne može biti prazan.</div>
                )}
            </div>
            {questions.map((q, index) => (
                <div key={index} className="card mb-3">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-6 mb-2 mb-md-0">
                                <input
                                    type="text"
                                    name="question"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(index, e)}
                                    className={`form-control ${q.error ? "is-invalid" : ""}`}
                                    placeholder="Unesi pitanje"
                                />
                                {q.error && (
                                    <div className="invalid-feedback">
                                        Pitanje ne može biti prazno.
                                    </div>
                                )}
                            </div>
                            <div className="col-md-3 mb-2 mb-md-0">
                                <select
                                    name="type"
                                    value={q.type}
                                    onChange={(e) => handleQuestionChange(index, e)}
                                    className="form-control"
                                >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio">Radio</option>
                                </select>
                            </div>
                            <div className="col-md-2 mb-2 mb-md-0">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        name="optional"
                                        checked={q.optional}
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        className="form-check-input"
                                        id={`optionalCheck-${index}`}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`optionalCheck-${index}`}
                                    >
                                        Opcionalno
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-1 text-md-end">
                                <button
                                    onClick={() => deleteQuestion(index)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Obriši
                                </button>
                            </div>
                        </div>

                        {["checkbox", "radio"].includes(q.type) && (
                            <div className="mt-3">
                                <h6>Options:</h6>
                                {q.options.map((opt, optIndex) => (
                                    <div
                                        key={optIndex}
                                        className="row mb-2 align-items-center"
                                    >
                                        <div className="col-8">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(index, optIndex, e)}
                                                className={`form-control ${q.optionError ? "is-invalid" : ""}`}
                                                placeholder={`Option ${optIndex + 1}`}
                                            />
                                        </div>
                                        <div className="col-4 text-end">
                                            <button
                                                onClick={() => deleteOption(index, optIndex)}
                                                className="btn btn-danger btn-sm"
                                                disabled={q.options.length === 1}
                                            >
                                                Obriši opciju
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addOption(index)}
                                    className="btn btn-primary"
                                >
                                    Dodaj opciju
                                </button>
                                {q.optionError && (
                                    <div className="text-danger mt-2">
                                        Mora postojati barem jedna opcija.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {questionError && (
                <div className="text-danger mb-3">
                    Moraš dodati barem jedno pitanje u anketu
                </div>
            )}
            <button onClick={addQuestion} className="btn btn-primary me-2 mb-3">
                Dodaj pitanje
            </button>
            <div className="col-md-3 mb-3 mb-md-0 mt-3">
                <select
                    className="form-control"
                    value={selectedCollection}
                    onChange={handleSelectChange}
                >
                    <option value="" disabled>Odaberi kolekciju</option>
                    {textCollections.map((collection, index) => (
                        <option key={index} value={collection}>
                            {collection}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleSurveySubmit} className="btn btn-success mb-3 mt-3">
                Napravi anketu
            </button>
        </div>
    );
};
