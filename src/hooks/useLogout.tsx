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
