import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import useCustomEffect from "../hooks/useCustomEffect";
import useLogout from "../hooks/useLogout";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const breadcrumbNameMap: { [key: string]: string } = {
  "/": "Home",

  "/register": "Register",
  "/register/caregiver": "Caregiver",
  "/register/patient": "Patient",
  "/register/statehead": "State Head",
  "/register/telecaller": "Telecaller",

  "/visit": "Visit Follow-Up",
  "/patient-dashboard": "Patient Search",
  "/reports": "Reports",
  "/settings": "Settings",
  "/profile": "Profile",
  "/sms-module": "SMS Module",

  "/user": "User",
  "/user/statehead": "State head",
  "/user/telecaller": "Telecaller",
};

const PageLayout = () => {
  const logout = useLogout();
  const userState = useSelector((state: any) => state.userState); // Replace `auth.user` with your actual state path

  useEffect(() => {
    if (userState !== null) return; // Wait until Redux state is available

    const handleStorageChange = () => {
      if (!localStorage.getItem("userState")) {
        logout();
      }
    };

    // Check initially and listen for changes
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [localStorage.getItem("userState")]); // Run only when userState updates

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <Navbar />
      {/* Breadcrumbs Section */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2, mb: 1, ml: 2 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Typography key={to} color="textPrimary">
              {breadcrumbNameMap[to] || value}
            </Typography>
          ) : (
            <Link key={to} component={RouterLink} to={to} color="inherit">
              {breadcrumbNameMap[to] || value}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* Main Content */}
      <main style={{ height: "84vh", overflow: "auto" }}>
        <Outlet />
      </main>
    </>
  );
};

export default PageLayout;
