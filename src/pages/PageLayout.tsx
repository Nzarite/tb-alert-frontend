import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import Navbar from "../components/Navbar";
import "../index.css";

const breadcrumbNameMap: { [key: string]: string } = {
  "/": "Home",

  "/register": "Register",
  "/register/caregiver": "Caregiver",
  "/register/patient": "Patient",
  "/register/statehead": "State Head",
  "/register/telecaller": "Telecaller",
  "/register/fieldcoordinator": "Field Coordinator",
  "/register/gphead": "GP Head",

  "/visit": "Visit Follow-Up",
  "/patient-dashboard": "Patient Search",
  "/reports": "Reports",
  "/settings": "Settings",
  "/profile": "Profile",
  "/sms-module": "SMS Module",

  "/user": "User",
  "/user/statehead": "State head",
  "/user/telecaller": "Telecaller",
  "/user/fieldcoordinator": "Field Coordinator",
  "/user/gphead": "GP Head",
};

const PageLayout = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        transition={Zoom}
        autoClose={5000}
        hideProgressBar
        theme="colored"
      />
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
