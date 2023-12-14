import axios from "axios";

export default axios.create({
  //baseURL: "http://localhost:5118",
  baseURL: "https://blaljuskartan-api.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});
