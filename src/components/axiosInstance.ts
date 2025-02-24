import axios, { InternalAxiosRequestConfig } from "axios";

const BACKEND_SERVICE_NAME =
  "http://" + (import.meta.env.BACKEND_SERVICE_NAME || "localhost");
const SERVER_PORT = import.meta.env.SPRINGBOOT_HOST_PORT || "8080";

const axiosInstance = axios.create({
  baseURL: `${BACKEND_SERVICE_NAME}:${SERVER_PORT}`,
  timeout: 10000,
});

const attachToken = (
  config: InternalAxiosRequestConfig<any>,
  getToken: { (): string | null; (): any }
) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

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

export default axiosInstance;
