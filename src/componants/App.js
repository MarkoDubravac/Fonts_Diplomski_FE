import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "../logo.svg";
import Header from "./Header";
import Footer from "./Footer";
import ParticipentLogin from "./ParticipentLogin";
import ThreeCardsRow from "./ThreeCardsRow";
import ReviewingCard from "./ReviewingCard";
import BarChart from "./BarChart";

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
                  <Route path="/" exact Component={ParticipentLogin} />
                  <Route path="/home" Component={ThreeCardsRow} />
                  <Route path="/review" Component={ReviewingCard} />
                  <Route path="/graphs" Component={BarChart} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
