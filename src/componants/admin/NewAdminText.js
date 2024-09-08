import React, {useEffect, useState} from 'react';
import {request} from "../../axios_helper";
import {Accordion, Form} from 'react-bootstrap';

const fonts = {
    SANS_SERIF: [
        "Arial", "Helvetica", "Verdana", "Roboto", "Tahoma"
    ],
    SERIF: [
        "Times New Roman", "Georgia", "Palatino", "Playfair Display", "Merriweather"
    ],
    MONOSPACE: [
        "Courier New", "Lucida Console", "Consolas", "Space Mono", "Roboto Mono"
    ],
    CURSIVE: [
        "Comic Sans MS", "Brush Script MT", "Segoe Script", "Cedarville Cursive"
    ],
    FANTASY: [
        "Impact", "Metal Mania", "Mountains of Christmas", "Freckle Face", "Creepster"
    ]
};

const fontCategoryDefaults = {
    SANS_SERIF: "Arial",
    SERIF: "Times",
    MONOSPACE: "Courier",
    CURSIVE: "Comic Sans MS",
    FANTASY: "Impact"
};

const FontCheckboxes = ({fontCategory, selectedFonts, setSelectedFonts}) => {
    const handleFontChange = (event) => {
        const font = event.target.name;
        const family = fontCategory;

        if (event.target.checked) {
            setSelectedFonts((prevSelectedFonts) => [
                ...prevSelectedFonts,
                {name: font, family}
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
                    label={<span style={{fontFamily: font}}>{font}</span>}
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
    const [collectionTitle, setCollectionTitle] = useState({value: "", error: false});
    const [newText, setNewText] = useState({value: "", error: false});
    const [textCollections, setTextCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedFonts, setSelectedFonts] = useState([]);
    const [fontError, setFontError] = useState(false);
    const [fontCount, setFontCount] = useState(0);
    const [textCount, setTextCount] = useState(0);

    const handleTitleChange = (event) => {
        setCollectionTitle({value: event.target.value, error: false});
    };

    const handleNewTextChange = (event) => {
        setNewText({value: event.target.value, error: false});
    };

    const handleCreateCollection = () => {
        if (!collectionTitle.value.trim()) {
            setCollectionTitle({...collectionTitle, error: true});
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
                setCollectionTitle({value: "", error: false});
                setSelectedFonts([]);
            })
            .catch((error) => {
                console.error("Error on submitting collection:", error);
            });
    };

    useEffect(() => {
        request("GET", "/admin/getTextCollections")
            .then((response) => {
                const textCollectionsData = response.data.map((item) => item);
                setTextCollections(textCollectionsData);
            })
            .catch((error) => {
                console.error("Error fetching text collection: ", error);
            });
    }, [collectionTitle]);

    const handleSelectChange = (e) => {
        const selected = e.target.value;
        setSelectedCollection(selected);
        const collection = textCollections.find(c => c.name === selected);
        if (collection) {
            setFontCount(collection.fonts.length);
            setTextCount(collection.surveyTexts.length);
        } else {
            setFontCount(0);
            setTextCount(0);
        }
    };

    const handleAddToCollection = () => {
        if (!newText.value.trim()) {
            setNewText({...newText, error: true});
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
                setNewText({value: "", error: false});
            })
            .catch((error) => {
                console.error("Error adding text to collection:", error);
            });
    };

    return (
        <div className="container mt-4">
            <h5 className="mb-2">Nova kolekcija</h5>
            <p>Kolekcija je skup fontova i tekstova koji se ocjenjuju.</p>
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
                            <Accordion.Header style={{fontFamily: fontCategoryDefaults[category]}}>
                                {category.replace(/_/g, ' ')}
                            </Accordion.Header>
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
                    className="btn btn-success mt-3"
                >
                    Napravi kolekciju
                </button>
            </div>
            <h5 className="mb-2">Dodaj tekst u kolekciju</h5>
            <p>Tekst je tekst pomoću kojeg se provodi istraživanje.</p>
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
                            <option key={index} value={collection.name}>
                                {collection.name}
                            </option>
                        ))}
                    </select>
                    {selectedCollection && (
                        <div className="mt-2">
                            Kolekcija
                            ima {fontCount} font{fontCount !== 1 ? 'ova' : 'a'} i {textCount} tekst{textCount !== 1 ? 'ova' : ''}.
                        </div>
                    )}
                </div>
                <button
                    onClick={handleAddToCollection}
                    className="btn btn-success mt-3"
                >
                    Dodaj u kolekciju
                </button>
            </div>
        </div>
    );
}
