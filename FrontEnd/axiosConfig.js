// src/axiosConfig.js
import axios from "axios";
const instance = axios.create({
  baseURL: "http://192.168.10.166:3000/",

  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
