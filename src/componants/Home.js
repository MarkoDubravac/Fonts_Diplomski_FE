import React, {useState} from "react";
import {Button, Card} from "react-bootstrap";
import Form from "react-bootstrap/Form"
import {useNavigate} from "react-router-dom";

function Home() {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleNavigate = () => {
        if (inputValue.length === 6) {
            navigate(`/${inputValue}`);
        } else {
            alert('Kod ankete ima točno 6 znakova!');
        }
    };

    return (
        <div className="row mb-3 p-3">
            <div className="container d-grid" style={{placeItems: "center"}}>
                <Card className="col-sm-6 p-4">
                    <Card.Body>
                        <h2 className="mb-4">Dobro došli u Font Readability Assessment!</h2>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/admin")}
                        >
                            Prijavi se kao admin
                        </Button>
                        <Form className="mb-3 mt-3">
                            <Form.Group controlId="formBasicInput">
                                <Form.Control
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    maxLength={6}
                                    placeholder="Unesi kod ankete"
                                />
                            </Form.Group>
                        </Form>
                        <Button
                            variant="secondary"
                            onClick={handleNavigate}
                        >
                            Prijavi se u anketu
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Home;
