// src/axiosConfig.js
import axios from 'axios';
const instance = axios.create({
    baseURL: "http://10.66.174.163:3000/",    //backend

    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export default instance;
  