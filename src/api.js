import axios from 'axios';

console.log("Base URL:", process.env.REACT_APP_BACKEND_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default api;