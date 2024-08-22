import React, { useEffect, useState } from 'react';
import { request } from "../../axios_helper";
import { Accordion, Form } from 'react-bootstrap';

const sansSerifFonts = [
    "Arial", "Helvetica", "Verdana", "Trebuchet MS", "Gill Sans", "Noto Sans", "Optima", "Arial Narrow"
];

const serifFonts = [
    "Times", "Didot", "Georgia", "Palatino", "Bookman", "New Century Schoolbook", "American Typewriter"
];

const monospaceFonts = [
    "Andale Mono", "Courier New", "Courier", "FreeMono", "OCR A Std", "DejaVu Sans Mono"
];

const cursiveFonts = [
    "Comic Sans MS", "Apple Chancery", "Bradley Hand", "Brush Script MT", "Snell Roundhand", "URW Chancery L"
];

const fantasyFonts = [
    "Impact", "Luminari", "Chalkduster", "Jazz LET", "Blippo", "Stencil Std", "Marker Felt", "Trattatello"
];

const FontCheckboxes = ({ fonts, selectedFonts, setSelectedFonts }) => {
    const handleFontChange = (event) => {
        const font = event.target.name;
        if (event.target.checked) {
            setSelectedFonts((prevSelectedFonts) => [...prevSelectedFonts, font]);
        } else {
            setSelectedFonts((prevSelectedFonts) =>
                prevSelectedFonts.filter((selectedFont) => selectedFont !== font)
            );
        }
    };

    return (
        <Form>
            {fonts.map((font, index) => (
                <Form.Check
                    type="checkbox"
                    id={font.toLowerCase().replace(/\s+/g, '')}
                    label={font}
                    name={font}
                    key={index}
                    checked={selectedFonts.includes(font)}
                    onChange={handleFontChange}
                />
            ))}
        </Form>
    );
};

export default function NewAdminText() {
    const [collectionTitle, setCollectionTitle] = useState({ value: "", error: false });
    const [newText, setNewText] = useState({ value: "", error: false });
    const [textCollections, setTextCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedFonts, setSelectedFonts] = useState([]);
    const [fontError, setFontError] = useState(false); // New state to handle font selection error

    const handleTitleChange = (event) => {
        setCollectionTitle({ value: event.target.value, error: false });
    };

    const handleNewTextChange = (event) => {
        setNewText({ value: event.target.value, error: false });
    };

    const handleCreateCollection = () => {
        if (!collectionTitle.value.trim()) {
            setCollectionTitle({ ...collectionTitle, error: true });
            return;
        }

        if (selectedFonts.length === 0) {
            setFontError(true); // Show error if no fonts are selected
            return;
        }

        setFontError(false); // Clear the font error if validation passes

        const newCollection = {
            name: collectionTitle.value,
            fonts: selectedFonts
        };

        request("POST", "/saveTextCollection", newCollection)
            .then(() => {
                alert(`Collection created: ${collectionTitle.value}`);
                setCollectionTitle({ value: "", error: false });
                setSelectedFonts([]);
            })
            .catch((error) => {
                console.error("Error on submitting collection:", error);
            });
    };

    useEffect(() => {
        request("GET", "/getTextCollections")
            .then((response) => {
                const textCollectionsData = response.data.map((item) => item.name);
                setTextCollections(textCollectionsData);
                console.log(textCollectionsData);
            })
            .catch((error) => {
                console.error("Error fetching text collection: ", error);
            });
    }, [collectionTitle]);

    const handleSelectChange = (e) => {
        setSelectedCollection(e.target.value);
    };

    const handleAddToCollection = () => {
        if (!newText.value.trim()) {
            setNewText({ ...newText, error: true });
            return;
        }

        if (!selectedCollection) {
            alert("Please select a collection.");
            return;
        }

        const surveyTextDto = {
            text: newText.value,
            textCollectionName: selectedCollection,
        };

        console.log(surveyTextDto);

        request("POST", "/createSurveyText", surveyTextDto)
            .then(() => {
                alert(`Text added to collection: ${selectedCollection}`);
                setNewText({ value: "", error: false });
            })
            .catch((error) => {
                console.error("Error adding text to collection:", error);
            });
    };

    return (
        <div className="container mt-4">
            <h5 className="mb-3">Create Collection</h5>
            <div className="mb-3">
                <input
                    type="text"
                    value={collectionTitle.value}
                    onChange={handleTitleChange}
                    className={`form-control ${collectionTitle.error ? "is-invalid" : ""}`}
                    placeholder="Enter collection name"
                />
                {collectionTitle.error && (
                    <div className="invalid-feedback">Survey title cannot be empty.</div>
                )}

                <Accordion className="mt-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Sans-Serif</Accordion.Header>
                        <Accordion.Body>
                            <FontCheckboxes fonts={sansSerifFonts} selectedFonts={selectedFonts} setSelectedFonts={setSelectedFonts} />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Serif</Accordion.Header>
                        <Accordion.Body>
                            <FontCheckboxes fonts={serifFonts} selectedFonts={selectedFonts} setSelectedFonts={setSelectedFonts} />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Monospace</Accordion.Header>
                        <Accordion.Body>
                            <FontCheckboxes fonts={monospaceFonts} selectedFonts={selectedFonts} setSelectedFonts={setSelectedFonts} />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Cursive</Accordion.Header>
                        <Accordion.Body>
                            <FontCheckboxes fonts={cursiveFonts} selectedFonts={selectedFonts} setSelectedFonts={setSelectedFonts} />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Fantasy</Accordion.Header>
                        <Accordion.Body>
                            <FontCheckboxes fonts={fantasyFonts} selectedFonts={selectedFonts} setSelectedFonts={setSelectedFonts} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                {fontError && (
                    <div className="text-danger mt-2">Please select at least one font.</div>
                )}

                <button
                    onClick={handleCreateCollection}
                    className="btn btn-success btn-sm mt-3"
                >
                    Create Collection
                </button>
            </div>
            <h5 className="mb-3">Add Text To Collection</h5>
            <div className="mb-3">
                <textarea
                    value={newText.value}
                    onChange={handleNewTextChange}
                    className={`form-control ${newText.error ? "is-invalid" : ""}`}
                    placeholder="Enter text"
                />
                {newText.error && (
                    <div className="invalid-feedback">Text cannot be empty.</div>
                )}
                <div className="col-md-3 mb-2 mb-md-0 mt-3">
                    <select
                        className="form-control"
                        value={selectedCollection}
                        onChange={handleSelectChange}
                    >
                        <option value="" disabled>Select a collection</option>
                        {textCollections.map((collection, index) => (
                            <option key={index} value={collection}>
                                {collection}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleAddToCollection}
                    className="btn btn-success btn-sm mt-3"
                >
                    Add To Collection
                </button>
            </div>
        </div>
    )
};
