import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const getAuthToken = () => {
  return window.localStorage.getItem("auth_token");
};

export const setAuthToken = (token) => {
  window.localStorage.setItem("auth_token", token);
};

export const request = (method, url, data) => {
  let headers = {};
  if (
    url !== "/apply" &&
    getAuthToken() !== null &&
    getAuthToken() !== "null"
  ) {
    headers = { Authorization: `Bearer ${getAuthToken()}` };
  }

  const surveySessionToken = getSurveySessionToken();
  if (surveySessionToken) {
    headers["Survey-Session"] = surveySessionToken;
  }

  return axios({
    method: method,
    headers: headers,
    url: url,
    data: data,
  });
};

axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        console.error('Full Error Response:', error.response);

        const status = error.response.status;

        if (status === 401) {
          console.error("Token expired or unauthorized. Redirecting to home page.");

          // Remove tokens from local storage.
          window.localStorage.removeItem("auth_token");
          window.localStorage.removeItem("token");

          // Redirect to home page.
          window.location.href = "/admin";

        } else if (status === 500) {
          // Handle 500 error specifically
          console.error("Internal server error. Please try again later.");
        }
      } else {
        console.error("Request failed:", error.message);
      }

      return Promise.reject(error);
    }
);



export const getSurveySessionToken = () => {
  return window.localStorage.getItem("survey_session_token");
};

export const setSurveySessionToken = (token) => {
  window.localStorage.setItem("survey_session_token", token);
};

export const startSurveySession = () => {
  const sessionToken = uuidv4();
  setSurveySessionToken(sessionToken);
  return sessionToken;
};