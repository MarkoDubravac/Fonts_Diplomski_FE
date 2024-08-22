import React, { useState } from "react";
import classNames from "classnames";

export default function LoginForm({ onLogin, onRegister }) {
  const [active, setActive] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    login: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    if (typeof onLogin === 'function') {
      onLogin(e, formData.login, formData.password);
    } else {
      console.error('onLogin is not a function');
    }
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();
    if (typeof onRegister === 'function') {
      onRegister(e, formData.firstName, formData.lastName, formData.login, formData.password);
    } else {
      console.error('onRegister is not a function');
    }
  };

  return (
      <div className="row justify-content-center mt-5">
        <div className="col-4">
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

                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign In
                </button>
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

                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}
