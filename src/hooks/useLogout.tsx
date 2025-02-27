import { useEffect, useCallback } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch } from "react-redux";
import { clearUserProfile } from "../redux/userSlice";

const useLogout = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    console.warn("Logging out user...");

    // Clear Redux state
    dispatch(clearUserProfile());

    // Clear session and local storage
    // sessionStorage.removeItem(
    //   `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${
    //     import.meta.env.VITE_OIDC_CLIENT_ID
    //   }`
    // );

    // Keycloak logout
    await auth.signoutRedirect();
  }, [auth, dispatch]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("logout", handleUnauthorized);
    return () => window.removeEventListener("logout", handleUnauthorized);
  }, [logout]);

  return logout; // In case you want to call it directly in a component
};

export default useLogout;
