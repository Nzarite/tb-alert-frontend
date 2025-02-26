import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import useLogout from "../hooks/useLogout";
import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

const PageLayout = () => {
  const auth = useAuth();
  const logout = useLogout();
  const [isCheckingState, setIsCheckingState] = useState(true);

  useEffect(() => {
    const handleLogout = () => {
      console.log("Logout event triggered");
      logout();
    };

    window.addEventListener("logout", handleLogout);
    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [logout]);

  useEffect(() => {
    if (auth.isLoading) {
      console.log("Auth is still loading...");
      return;
    }

    console.log("Auth loaded:", auth.isAuthenticated);
    const userState = localStorage.getItem("userState");

    // Only check for missing state if user is authenticated and we've finished loading
    if (auth.isAuthenticated) {
      if (!userState) {
        console.warn(
          "User is authenticated but no user state found — logging out."
        );
        logout();
      } else {
        console.log("User state found:", userState);
      }
    }

    setIsCheckingState(false);
  }, [auth.isAuthenticated, auth.isLoading, logout]);

  if (auth.isLoading || isCheckingState) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main style={{ height: "100vh", overflow: "auto" }}>
        <Outlet />
      </main>
    </>
  );
};

export default PageLayout;
