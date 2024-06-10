import React, { useState, useEffect } from "react";
import { request } from "../axios_helper";
import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Container, Row, Col } from "react-bootstrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales",
        data: [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

  const [chartData1, setChartData1] = useState({
    labels: [],
    datasets: [
      {
        label: "Sales",
        data: [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    request("GET", "/stats")
      .then((response) => {
        console.log(response.data);
        const fonts = response.data.map((item) => item.font);
        const ratings = response.data.map((item) => item.rating);
        setChartData({
          labels: fonts,
          datasets: [
            {
              label: "Ocjena",
              data: ratings,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
  }, []);

  useEffect(() => {
    request("GET", "/stats/duration")
      .then((response) => {
        console.log(response.data);
        const fonts = response.data.map((item) => item.font);
        const ratings = response.data.map((item) => item.rating);
        setChartData1({
          labels: fonts,
          datasets: [
            {
              label: "Vrijeme/s",
              data: ratings,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ocjena",
      },
    },
  };

  return (
    <Container>
      <Row className="mb-3 justify-content-center">
        <Col xs={12} className="text-center mb-3">
          <h2>Grafovi</h2>
        </Col>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-3">
          <Card>
            <Card.Body>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Bar data={chartData} options={options} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6} className="mb-3">
          <Card>
            <Card.Body>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Bar data={chartData1} options={options} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BarChart;
