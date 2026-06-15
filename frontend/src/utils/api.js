// src/utils/api.js
// Central API base URL.
// Uses REACT_APP_API_URL env var if set, otherwise falls back to Railway production URL.
const API = process.env.REACT_APP_API_URL || "https://transcedental-farmer-testing-production.up.railway.app";

export default API;
