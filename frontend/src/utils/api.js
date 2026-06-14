// src/utils/api.js
// Central API base URL — controlled by environment variable.
// Locally: uses http://localhost:5000 (from .env.local)
// Production: set REACT_APP_API_URL in Vercel/Render dashboard to your deployed backend URL

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API;
