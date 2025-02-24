import axios from "axios";

const BACKEND_SERVICE_NAME =
  "http://" + (import.meta.env.BACKEND_SERVICE_NAME || "localhost");
const SERVER_PORT = import.meta.env.SPRINGBOOT_HOST_PORT || "8080";

const axiosInstance = axios.create({
  baseURL: `${BACKEND_SERVICE_NAME}:${SERVER_PORT}`,
  timeout: 10000,
});

const oidcSessionKey = `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${import.meta.env.VITE_OIDC_CLIENT_ID}`;

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve the session data from sessionStorage
      const sessionData = sessionStorage.getItem(oidcSessionKey);

      if (sessionData) {
        const parsedSessionData = JSON.parse(sessionData);
        const accessToken = parsedSessionData.access_token; // Extract the access token

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`; // Attach token to headers
        } else {
          console.warn("Access token not found in session data");
        }
      } else {
        console.warn("No session data found in sessionStorage");
      }

      return config;
    } catch (error) {
      console.error("Error retrieving access token:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request detected. Logging out...");

      // Remove token from storage
      sessionStorage.removeItem(
        `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${
          import.meta.env.VITE_OIDC_CLIENT_ID
        }`
      );

      // Redirect to Keycloak logout URL
      window.location.href = `${import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI}`;

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
