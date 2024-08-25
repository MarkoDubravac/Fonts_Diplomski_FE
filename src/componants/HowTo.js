import React from "react";
import { Button, Carousel } from 'react-bootstrap';
import howTo1 from "../howTo/how_to1.png";
import howTo2 from "../howTo/how_to2.png";
import howTo3 from "../howTo/how_to3.png";
import howTo4 from "../howTo/how_to4.png";
import {useNavigate, useParams} from "react-router-dom";

function HowTo() {
    const navigate = useNavigate();
    const {uuid} = useParams();
    return (
        <div>
            <div className="mt-5 mb-5 carousel-container">
                <h2>Kako funkcionira recenziranje? Pogledaj slike!</h2>
                <Carousel data-bs-theme="dark" interval={null} indicators={true}>
                    <Carousel.Item>
                        <img src={howTo1} className="d-block w-100" alt="How To 1"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={howTo2} className="d-block w-100" alt="How To 2"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={howTo3} className="d-block w-100" alt="How To 3"/>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src={howTo4} className="d-block w-100" alt="How To 4"/>
                    </Carousel.Item>
                </Carousel>
            </div>
            <div className="col-12 text-center mt-4 mb-4">
                <Button onClick={() => navigate(`/${uuid}/home`)}>Vrati me na početni zaslon</Button>
            </div>
        </div>
    );
}

export default HowTo;
