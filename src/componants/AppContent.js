import * as React from "react";
import ParticipentLogin from "./ParticipentLogin";
import AuthContent from "./AuthContent";
import LoginForm from "./LoginForm";
import Buttons from "./Buttons";

import { request, setAuthToken } from "../axios_helper";
import { jwtDecode } from "jwt-decode";
import AuthContentAdmin from "./AuthContentAdmin";

export default class AppContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentToShow: "welcome",
      role: "user",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("HELOOOOOOOOOOOOOOOOOOOOO");
      console.log(decoded.role);
      this.setState({
        componentToShow: "messages",
        role: decoded.role,
      });
      setAuthToken(token);
    }
  }

  login = () => {
    this.setState({ componentToShow: "login" });
  };

  logout = () => {
    setAuthToken(null);
    localStorage.removeItem("token");
    this.setState({ componentToShow: "welcome" });
  };

  onLogin = (e, username, password) => {
    e.preventDefault();
    request("POST", "/login", { login: username, password: password })
      .then((response) => {
        const decoded = jwtDecode(response.data.token);
        if (decoded.role === "ADMIN") {
          this.setState({
            componentToShow: "messagesAdmin",
            role: decoded.role,
          });
        } else {
          this.setState({
            componentToShow: "messages",
            role: decoded.role,
          });
        }
        setAuthToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      })
      .catch((error) => {
        this.setState({ componentToShow: "welcome" });
      });
  };

  onRegister = (e, firstName, lastName, username, password) => {
    e.preventDefault();
    request("POST", "/register", {
      firstName: firstName,
      lastName: lastName,
      login: username,
      password: password,
    })
      .then((response) => {
        this.setState({
          componentToShow: "messages",
          role: "USER",
        });
        setAuthToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      })
      .catch((error) => {
        this.setState({ componentToShow: "welcome" });
      });
  };

  render() {
    return (
      <div>
        <Buttons login={this.login} logout={this.logout}></Buttons>
        {this.state.componentToShow === "welcome" && <ParticipentLogin />}
        {this.state.componentToShow === "messages" && <AuthContent />}
        {this.state.componentToShow === "messagesAdmin" && <AuthContentAdmin />}
        {this.state.componentToShow === "login" && (
          <LoginForm onLogin={this.onLogin} onRegister={this.onRegister} />
        )}
      </div>
    );
  }
}
