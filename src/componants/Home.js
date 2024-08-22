import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="row mb-3 p-3">
            <div className="container d-grid" style={{ placeItems: "center" }}>
                <Card className="col-sm-6 p-4">
                    <Card.Body>
                        <h2 className="mb-4">Welcome to Font Readability Assessment</h2>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/admin")}
                        >
                            Go to Login
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/123456")}
                        >
                            Go to Home
                        </Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Home;
