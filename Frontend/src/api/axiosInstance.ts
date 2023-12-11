import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5118",
  headers: {
    "Content-Type": "application/json",
  },
});
