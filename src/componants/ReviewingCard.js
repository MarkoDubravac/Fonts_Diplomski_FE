import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import StarRating from "./StarRating";
import {getSurveySessionToken, request} from "../axios_helper";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";
import {useNavigate, useParams} from "react-router-dom";

function ReviewingCard() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showNewText, setShowNewText] = useState(false);
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const [currentPageText, setCurrentPageText] = useState("");
  const [count, setCount] = useState(0);
  const [fonts, setFonts] = useState([]);
  const [currentFont, setCurrentFont] = useState();
  const { uuid } = useParams();

  useEffect(() => {
    console.log("Fetching total count of texts!");
    request("GET", `/count?uuid=${uuid}`)
      .then((response) => {
        setCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Fetching fonts!");
    request("GET", `/fonts?uuid=${uuid}`)
        .then((response) => {
          console.log(response.data);
          setFonts(response.data);
          setCurrentFont(response.data[0]);
        })
        .catch((error) => {
          console.error("Error fetching count:", error);
        });
  }, []);

  useEffect(() => {
    request("GET", `/review?id=${page}`)
      .then((response) => {
        setCurrentPageText(response.data);
        setRating(0);
      })
      .catch((error) => {
        console.error("Error sending initial review request:", error);
      });
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
      surveySession: getSurveySessionToken()
    })
      .then(() => {
        console.log(getSurveySessionToken());
        console.log("Review submitted successfully: ", rating);
        setPage((prevPage) => prevPage + 1);
        setShowNewText(false);
        setTimer(0);
        setIsRunning(true);
        setCurrentFont(fonts[page]);
        if (page === count) navigate(`/${uuid}/graphs`);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
      });
  };

  return (
    <div className="row mb-3">
      <div className="container d-grid" style={{ placeItems: "center" }}>
        {showNewText ? (
          <Alert className="w-100 rounded-0 font-weight-bold" variant="primary">
            Timer će se pokrenuti pritiskom na next!
          </Alert>
        ) : (
          <div></div>
        )}
        <Card className={"col-sm-6 mb-3 mt-3 text-justify"}>
          <Card.Body>
            <div style={{ fontFamily: currentFont }}>{currentPageText}</div>
          </Card.Body>
        </Card>
        {showNewText ? (
          <div>
            <div className="mb-3">
              Kako biste ocjenili čitljivost <b>FONTA*</b> pročitanog teksta?
            </div>
            <StarRating rating={rating} setRating={setRating} />
          </div>
        ) : (
          <Button className="mb-3" onClick={handleStop}>
            Stop
          </Button>
        )}
        {showNewText ? (
          <Form onSubmit={handleSubmit} className="mb-3">
            <Button type="submit">Next</Button>
          </Form>
        ) : (
          <div></div>
        )}
        <div className="mt-4 d-block col-12 col-sm-6">
          <div className="text-justify">
            {page}/{count}
          </div>
          <ProgressBar min={1} max={count + 1} now={page} animated />
        </div>
      </div>
    </div>
  );
}

export default ReviewingCard;
