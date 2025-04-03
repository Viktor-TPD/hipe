export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // Empty string means "same origin" - the server where the React app is hosted
    : "http://localhost:8080";
