import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { deleteTokens, updateTokens } from "../store/jwtSlice";
// import { store } from "../store/store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

// let isRefreshing = false;

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // This is done so that if the token is deleted here, it is deleted from redux as well.
      // Otherwise redux state would still have it upon deletion (till new access token is generated) which would be gone upon refresh.
      // So for making it easy, it is fetched from localstorage.
      // let accessToken = localStorage.getItem("access-token");

      // if (accessToken) {
      // 	const accessTokenExpiry = jwtDecode(accessToken).exp * 1000;

      // 	if (accessTokenExpiry < Date.now()) {
      // 		if (!isRefreshing) {
      // 			isRefreshing = true;

      // 			const rs = await getNewAccessAndRefreshToken();
      // 			const newAccessToken = rs.data.accessToken;

      // 			store.dispatch(updateTokens({ accessToken: newAccessToken }));
      // 			localStorage.setItem("access-token", newAccessToken);

      // 			isRefreshing = false;

      // 			config.headers.Authorization = `Bearer ${newAccessToken}`;
      // 		}
      // 	} else {
      // 		config.headers.Authorization = `Bearer ${accessToken}`;
      // 	}
      // } else {
      // 	console.warn("No accessToken found in localStorage");
      // }

      return config;
    } catch (error) {
      // store.dispatch(deleteTokens());
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response.status === 403 || error.response.status === 401)
    // 	store.dispatch(deleteTokens());
    return Promise.reject(error);
  }
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
