import React, {useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import StarRating from "./StarRating";
import {getSurveySessionToken, request} from "../axios_helper";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import {useNavigate, useParams} from "react-router-dom";
import info_fill from "../info_fill.svg"

function ReviewingCard() {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false); // Timer is not running initially
    const [showNewText, setShowNewText] = useState(false);
    const [rating, setRating] = useState(0);
    const [page, setPage] = useState(1);
    const [currentPageText, setCurrentPageText] = useState("");
    const [count, setCount] = useState(0);
    const [fonts, setFonts] = useState([]);
    const [currentFont, setCurrentFont] = useState();
    const {uuid} = useParams();

    useEffect(() => {
        request("GET", `/count?uuid=${uuid}`)
            .then((response) => {
                setCount(response.data);
            })
            .catch((error) => {
                console.error("Error fetching count:", error);
            });
    }, []);

    useEffect(() => {
        request("GET", `/fonts?uuid=${uuid}`)
            .then((response) => {
                setFonts(response.data);
                setCurrentFont(response.data[0]);
            })
            .catch((error) => {
                console.error("Error fetching fonts:", error);
            });
    }, []);

    useEffect(() => {
        request("GET", `/review?id=${page}&uuid=${uuid}`)
            .then((response) => {
                setCurrentPageText(response.data);
                setRating(0);
            })
            .catch((error) => {
                console.error("Error sending initial review request:", error);
            });

        if (page > 1) {
            setIsRunning(true);
        }
    }, [page]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
        setShowNewText(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setShowNewText(true);
        console.log("Time passed:", timer, "seconds");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        request("POST", "/submit", {
            duration: timer,
            font: currentFont,
            rating,
            surveySession: getSurveySessionToken(),
            participantSurveyUuid: uuid
        })
            .then(() => {
                setPage((prevPage) => prevPage + 1);
                setShowNewText(false);
                setTimer(0);
                setCurrentFont(fonts[page]);
                if (page === count) navigate(`/${uuid}/graphs`);
            })
            .catch((error) => {
                console.error("Error submitting review:", error);
            });
    };

    return (
        <div>
            <ProgressBar min={1} max={count + 1} now={page} style={{borderRadius: '0'}} striped variant="success"/>
            <div className="text-center mb-3">
                {page}/{count}
            </div>
            <div className="container d-grid" style={{placeItems: "center"}}>
                {page === 1 && !isRunning && timer === 0 && (
                    <Card className={"mb-3 mt-3 m-5"}>
                        <div className="d-flex justify-content-center mt-auto">
                            <Card.Img variant="top" className={"w-50"} src={info_fill}/>
                        </div>
                        <Card.Text className={"m-2"}>Molim vas pažljivo pročitajte nadolazeće tekstove.</Card.Text>
                        <Card.Text className={"m-2"}>Brojač je uključen za vrijeme čitanja.</Card.Text>
                        <Card.Text className={"m-2"}>Nakon što završite s čitanje pritisnite gumb zaustavi.</Card.Text>
                        <Button onClick={handleStart} style={{borderRadius: '0'}}>
                            Kreni
                        </Button>
                    </Card>
                )}
                {(isRunning || page > 1 || (page === 1 && timer !== 0)) && (
                    <Card className={"col-sm-6 mb-3 mt-3 text-justify"}>
                        <Card.Body>
                            <div style={{fontFamily: currentFont}}>{currentPageText}</div>
                        </Card.Body>
                    </Card>
                )}
                {showNewText ? (
                    <div>
                        <div className="mb-3">
                            Kako biste ocjenili čitljivost <b>FONTA*</b> pročitanog teksta?
                        </div>
                        <StarRating rating={rating} setRating={setRating}/>
                    </div>
                ) : (
                    (isRunning || page > 1) && (
                        <Button className="mb-3" onClick={handleStop}>
                            Stani
                        </Button>
                    )
                )}
                {showNewText ? (
                    <Form onSubmit={handleSubmit} className="mb-3">
                        <Button disabled={rating === 0} type="submit">Sljedeći</Button>
                    </Form>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}

export default ReviewingCard;
