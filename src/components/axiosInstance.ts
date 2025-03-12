import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { deleteTokens, updateTokens } from "../store/jwtSlice";
// import { store } from "../store/store";

const BACKEND_SERVICE_NAME =
  "http://" + (import.meta.env.VITE_BACKEND_SERVICE_NAME || "localhost:8080");
// const SERVER_PORT = import.meta.env.VITE_SPRINGBOOT_HOST_PORT || "8080";

const axiosInstance = axios.create({
  baseURL: `${BACKEND_SERVICE_NAME}`,
  timeout: 10000,
});

// let isRefreshing = false;
const oidcSessionKey = `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${
  import.meta.env.VITE_OIDC_CLIENT_ID
}`;

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

      

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
