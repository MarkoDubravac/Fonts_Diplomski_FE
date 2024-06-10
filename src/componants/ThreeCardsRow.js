import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BarChart from "../bar-chart-md.png";
import { Link } from "react-router-dom";

function ThreeCardsRow() {
  return (
    <Row className="gy-3 p-3">
      <Col xs={12} sm={6} md={4}>
        <Card className="hover-gray-out h-100">
          <Card.Body className="d-flex flex-column">
            <Card.Title className="mb-3">
              Kako funkcionira recenziranje
            </Card.Title>
            <Card.Text className="mb-3">
              Ukratko objašnjen način provođenja recenziranja fontova.
            </Card.Text>
            <div className="d-flex justify-content-center mt-auto">
              <Card.Img className="w-50" src={BarChart} alt="logo" />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Link to="/review" style={{ textDecoration: "none" }}>
          <Card className="hover-gray-out h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Recenziraj fontove</Card.Title>
              <Card.Text className="mb-3">
                Pročitajte dane paragrafe od početka do kraja. Mjeri se vrijeme
                provedeno čitajući. Postoji pauza između svakog paragrafa.
              </Card.Text>
              <div className="d-flex justify-content-center mt-auto">
                <img className="w-50" src={BarChart} alt="logo" />
              </div>
            </Card.Body>
          </Card>
        </Link>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Link to="/graphs" style={{ textDecoration: "none" }}>
          <Card className="hover-gray-out h-100" type="submit">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="mb-3">Grafovi</Card.Title>
              <Card.Text className="mb-3">
                Grafovi koji pokazuju vaše i ukupne (trenutne) rezultate.
              </Card.Text>
              <div className="d-flex justify-content-center mt-auto">
                <img className="w-50" src={BarChart} alt="logo" />
              </div>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    </Row>
  );
}

export default ThreeCardsRow;
