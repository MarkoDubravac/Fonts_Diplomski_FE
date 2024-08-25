import React, { useEffect, useState } from 'react';
import { request } from "../../axios_helper";
import { Accordion, Form } from 'react-bootstrap';

const fonts = {
    SANS_SERIF: [
        "Arial", "Helvetica", "Verdana", "Trebuchet MS", "Gill Sans", "Noto Sans", "Optima", "Arial Narrow"
    ],
    SERIF: [
        "Times", "Didot", "Georgia", "Palatino", "Bookman", "New Century Schoolbook", "American Typewriter"
    ],
    MONOSPACE: [
        "Andale Mono", "Courier New", "Courier", "FreeMono", "OCR A Std", "DejaVu Sans Mono"
    ],
    CURSIVE: [
        "Comic Sans MS", "Apple Chancery", "Bradley Hand", "Brush Script MT", "Snell Roundhand", "URW Chancery L"
    ],
    FANTASY: [
        "Impact", "Luminari", "Chalkduster", "Jazz LET", "Blippo", "Stencil Std", "Marker Felt", "Trattatello"
    ]
};

const FontCheckboxes = ({ fontCategory, selectedFonts, setSelectedFonts }) => {
    const handleFontChange = (event) => {
        const font = event.target.name;
        const family = fontCategory;

        if (event.target.checked) {
            setSelectedFonts((prevSelectedFonts) => [
                ...prevSelectedFonts,
                { name: font, family }
            ]);
        } else {
            setSelectedFonts((prevSelectedFonts) =>
                prevSelectedFonts.filter((selectedFont) => selectedFont.name !== font)
            );
        }
    };

    return (
        <Form>
            {fonts[fontCategory].map((font, index) => (
                <Form.Check
                    type="checkbox"
                    id={`${fontCategory}-${font.toLowerCase().replace(/\s+/g, '')}`}
                    label={font}
                    name={font}
                    key={index}
                    checked={selectedFonts.some(f => f.name === font && f.family === fontCategory)}
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
    const [fontError, setFontError] = useState(false);

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
            setFontError(true);
            return;
        }

        setFontError(false);

        const newCollection = {
            name: collectionTitle.value,
            fonts: selectedFonts
        };

        request("POST", "/admin/saveTextCollection", newCollection)
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
        request("GET", "/admin/getTextCollections")
            .then((response) => {
                const textCollectionsData = response.data.map((item) => item.name);
                setTextCollections(textCollectionsData);
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

        request("POST", "/admin/createSurveyText", surveyTextDto)
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
            <h5 className="mb-3">Napravi kolekciju</h5>
            <div className="mb-3">
                <input
                    type="text"
                    value={collectionTitle.value}
                    onChange={handleTitleChange}
                    className={`form-control ${collectionTitle.error ? "is-invalid" : ""}`}
                    placeholder="Unesi naziv kolekcije"
                />
                {collectionTitle.error && (
                    <div className="invalid-feedback">Naziv kolekcije ne može biti prazan.</div>
                )}

                <Accordion className="mt-3">
                    {Object.keys(fonts).map((category, index) => (
                        <Accordion.Item eventKey={index.toString()} key={category}>
                            <Accordion.Header>{category.replace(/_/g, ' ')}</Accordion.Header>
                            <Accordion.Body>
                                <FontCheckboxes
                                    fontCategory={category}
                                    selectedFonts={selectedFonts}
                                    setSelectedFonts={setSelectedFonts}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                {fontError && (
                    <div className="text-danger mt-2">Odaberite više fontova za kolekciju.</div>
                )}

                <button
                    onClick={handleCreateCollection}
                    className="btn btn-success btn-sm mt-3"
                >
                    Napravi kolekciju
                </button>
            </div>
            <h5 className="mb-3">Dodaj tekst u kolekciju</h5>
            <div className="mb-3">
                <textarea
                    value={newText.value}
                    onChange={handleNewTextChange}
                    className={`form-control ${newText.error ? "is-invalid" : ""}`}
                    placeholder="Unesi tekst"
                />
                {newText.error && (
                    <div className="invalid-feedback">Tekst ne može biti prazan.</div>
                )}
                <div className="col-md-3 mb-2 mb-md-0 mt-3">
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
                <button
                    onClick={handleAddToCollection}
                    className="btn btn-success btn-sm mt-3"
                >
                    Dodaj u kolekciju
                </button>
            </div>
        </div>
    );
}
