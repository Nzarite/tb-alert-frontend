import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUserProfile } from "../redux/userSlice";
import { useAuth } from "react-oidc-context";
// import { jwtDecode } from "jwt-decode";
// import { deleteTokens, updateTokens } from "../store/jwtSlice";
// import { store } from "../store/store";

const BACKEND_SERVICE_NAME =
  "http://" + (import.meta.env.BACKEND_SERVICE_NAME || "localhost");
const SERVER_PORT = import.meta.env.SPRINGBOOT_HOST_PORT || "8080";

const axiosInstance = axios.create({
  baseURL: `${BACKEND_SERVICE_NAME}:${SERVER_PORT}`,
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

      if (!localStorage.getItem("userState")) {
        window.dispatchEvent(new Event("logout"));
      }

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

// async function getNewAccessAndRefreshToken() {
// 	try {
// 		const res = await axios.post(
// 			"http://localhost:8080/refresh-token",
// 			{},
// 			{ withCredentials: true }
// 		);
// 		return res;
// 	} catch (err) {
// 		store.dispatch(deleteTokens());
// 		return Promise.reject(err);
// 	}
// }

export default axiosInstance;
