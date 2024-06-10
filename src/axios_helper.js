import axios from "axios";

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
  console.log("Making request to:", url);
  console.log("Headers:", headers);
  console.log("Data:", data);
  return axios({
    method: method,
    headers: headers,
    url: url,
    data: data,
  });
};
