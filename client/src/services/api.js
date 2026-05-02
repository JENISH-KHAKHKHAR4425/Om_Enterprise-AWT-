import axios from "axios";

const API = axios.create({
  baseURL: "/api"   // remove http://localhost:5000
});

export default API;