import React, {useState, useEffect} from "react";
import {getSurveySessionToken, request} from "../axios_helper";
import {Bar} from "react-chartjs-2";
import {Card, Button} from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {Container, Row, Col} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function ParticipantsStats() {
    const navigate = useNavigate();
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
    const session = getSurveySessionToken();
    const {uuid} = useParams();
    const [funFacts, setFunFacts] = useState({highestRated: "", lowestDuration: "", lowestRated: "", highestDuration: ""});
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
        request("GET", `/stats?session=${session}`)
            .then((response) => {
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
        request("GET", `/fun-facts?session=${session}&uuid=${uuid}`)
            .then((response) => {
                setFunFacts(response.data);
            }).catch((error) => {
            console.error("Error fetching count:", error);
        });
    }, []);

    useEffect(() => {
        request("GET", `/stats/duration?session=${session}`)
            .then((response) => {
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
            <Row className="mb-3 mt-3 justify-content-center">
                <h2>Tvoji Rezultati</h2>
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
                                    <Bar data={chartData} options={options}/>
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
                                    <Bar data={chartData1} options={options}/>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-3 mt-3 justify-content-center">
                <Card>
                    <Card.Title className="mt-3">Zanimljivosti</Card.Title>
                    <Card.Body>
                        <div>{funFacts.highestRated.length > 1 ? "Fontovi" : "Font"} koji za tebe ima/ju najbolju
                            čitljivost: {funFacts.highestRated.length > 1 ? funFacts.highestRated.join(', ') : funFacts.highestRated}</div>
                        <hr/>
                        <div>Najbrže
                            pročitani {funFacts.lowestDuration.length > 1 ? "fontovi" : "font"}: {funFacts.lowestDuration.length > 1 ? funFacts.lowestDuration.join(', ') : funFacts.lowestDuration}</div>
                        <hr/>
                        <div>{funFacts.lowestRated.length > 1 ? "Fontovi" : "Font"} koji za tebe ima/ju najgoru
                            čitljivost: {funFacts.lowestRated.length > 1 ? funFacts.lowestRated.join(', ') : funFacts.lowestRated}</div>
                        <hr/>
                        <div>Najsporije
                            pročitani {funFacts.highestDuration.length > 1 ? "fontovi" : "font"}: {funFacts.highestDuration.length > 1 ? funFacts.highestDuration.join(', ') : funFacts.highestDuration}</div>
                        <hr/>

                    </Card.Body>
                </Card>
            </Row>
            <Button onClick={() => navigate(`/${uuid}/graphs/all`)} className={"mb-3 w-100"}>Svi rezultati</Button>
        </Container>
    );
}

export default ParticipantsStats;
