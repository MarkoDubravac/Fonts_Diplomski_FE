import React, { useState } from "react";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";

export default function LoginForm({ onLogin, onRegister }) {
  const navigate = useNavigate();
  const [active, setActive] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (typeof onLogin === 'function') {
        const response = await onLogin(e, formData.login, formData.password);
        if (response && response.status) {
          console.log(response);
          if (response.status !== 200) {
            setError(response.data?.message || "Login failed. Please try again.");
          }
        } else if (!response && formData.login && formData.password) {
          console.log("Login successful with no response object");
        } else {
          setError("Unexpected response from server.");
          console.error("Invalid response format", response);
        }
      } else {
        console.error('onLogin is not a function');
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    }
  }

  const onSubmitRegister = (e) => {
    e.preventDefault();
    if (typeof onRegister === 'function') {
      onRegister(e, formData.firstName, formData.lastName, formData.login, formData.password);
    } else {
      console.error('onRegister is not a function');
    }
  };

  return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                    className={classNames("nav-link", active === "login" ? "active" : "")}
                    id="tab-login"
                    onClick={() => setActive("login")}
                >
                  Login
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                    className={classNames("nav-link", active === "register" ? "active" : "")}
                    id="tab-register"
                    onClick={() => setActive("register")}
                >
                  Register
                </button>
              </li>
            </ul>
            <div className="tab-content">
              <div className={classNames("tab-pane", "fade", active === "login" ? "show active" : "")} id="pill-login">
                <form onSubmit={onSubmitLogin}>
                  {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                  )}

                  <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="loginName"
                        name="login"
                        className="form-control"
                        onChange={onChangeHandler}
                    />
                    <label className="form-label" htmlFor="loginName">
                      Username
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        className="form-control"
                        onChange={onChangeHandler}
                    />
                    <label className="form-label" htmlFor="loginPassword">
                      Password
                    </label>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <button type="submit" className="btn btn-primary btn-block mb-4">
                      Sign In
                    </button>
                    <button onClick={() => navigate(`/`)} className="btn btn-primary btn-block mb-4">Back To Home
                    </button>
                  </div>
                </form>
              </div>

              <div className={classNames("tab-pane", "fade", active === "register" ? "show active" : "")} id="pills-register">
                <form onSubmit={onSubmitRegister}>
                  <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        onChange={onChangeHandler}
                    />
                    <label className="form-label" htmlFor="firstName">
                      First Name
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        onChange={onChangeHandler}
                    />
                    <label className="form-label" htmlFor="lastName">
                      Last Name
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="login"
                        name="login"
                        className="form-control"
                        onChange={onChangeHandler}
                    />
                    <label className="form-label" htmlFor="login">
                      Username
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        onChange={onChangeHandler}
                    />
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <button type="submit" className="btn btn-primary btn-block mb-4">
                      Register
                    </button>
                    <button onClick={() => navigate(`/`)} className="btn btn-primary btn-block mb-4">Back To Home
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
