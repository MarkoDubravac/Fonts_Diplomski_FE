import "./App.css";
import {BrowserRouter as Router, Route, Routes, useParams} from "react-router-dom";
import logo from "../logo.svg";
import Header from "./Header";
import Footer from "./Footer";
import ThreeCardsRow from "./ThreeCardsRow";
import ReviewingCard from "./ReviewingCard";
import BarChart from "./BarChart";
import ParticipantLoginTest from "./ParticipentLoginTesting";
import Home from "./Home";
import AdminContent from "./admin/AdminContent";
import {startSurveySession} from "../axios_helper";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Header
            pageTitle="Font readability assessment"
            logoSrc={logo}
          ></Header>
        </div>
        <div className="container-fluid p-0 App-content">
          <div className="row">
            <div className="col">
              <div>
                <Routes>
                  <Route path="/" exact element={<Home />} />
                  <Route path="/admin" exact element={<AdminContent />} />
                  <Route path="/:uuid" exact element={<ParticipantLoginTestingWrapper />} />
                  <Route path="/:uuid/home" element={<ThreeCardsRow />} />
                  <Route path="/:uuid/review" element={<ReviewingCard />} />
                  <Route path="/:uuid/graphs" element={<BarChart />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

function ParticipantLoginTestingWrapper() {
  const { uuid } = useParams();
  startSurveySession();
  return <ParticipantLoginTest surveyId={uuid} />;
}

export default App;
