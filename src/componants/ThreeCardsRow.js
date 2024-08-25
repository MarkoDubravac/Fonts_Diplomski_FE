import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import infoImage from "../info.svg";
import reviewImage from "../review.svg";
import graphsImage from "../graphs.svg";
import {Link, useParams} from "react-router-dom";

function ThreeCardsRow() {
  const { uuid } = useParams();
  return (
    <Row className="gy-3 p-3">
      <Col xs={12} sm={6} md={4}>
        <Link to={`/${uuid}/how-to`} style={{ textDecoration: "none" }}>
        <Card className="hover-gray-out h-100">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="mb-3">
              Kako funkcionira recenziranje
            </Card.Title>
            <Card.Text className="mb-3">
              Ukratko objašnjen način provođenja recenziranja fontova.
            </Card.Text>
            <div className="d-flex justify-content-center mt-auto">
              <Card.Img className="w-50" src={infoImage} loading="lazy" alt="logo" />
            </div>
          </Card.Body>
        </Card>
        </Link>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Link to={`/${uuid}/review`} style={{ textDecoration: "none" }}>
          <Card className="hover-gray-out h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Recenziraj fontove</Card.Title>
              <Card.Text className="mb-3">
                Pročitajte dane paragrafe od početka do kraja. Mjeri se vrijeme
                provedeno čitajući. Postoji pauza između svakog paragrafa.
              </Card.Text>
              <div className="d-flex justify-content-center mt-auto">
                <img className="w-50" src={reviewImage} loading="lazy" alt="logo" />
              </div>
            </Card.Body>
          </Card>
        </Link>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Link to={`/${uuid}/graphs`} style={{ textDecoration: "none" }}>
          <Card className="hover-gray-out h-100" type="submit">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Grafovi</Card.Title>
              <Card.Text className="mb-3">
                Grafovi koji pokazuju vaše i ukupne (trenutne) rezultate.
              </Card.Text>
              <div className="d-flex justify-content-center mt-auto">
                <img className="w-50" src={graphsImage} loading="lazy" alt="logo" />
              </div>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </Row>
  );
}

export default ThreeCardsRow;
