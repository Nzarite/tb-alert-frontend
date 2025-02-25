import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const breadcrumbNameMap: { [key: string]: string } = {
  "/": "Home",
  "/register": "Register",
  "/register/caregiver": "Caregiver",
  "/register/patient": "Patient",
  "/register/state-coordinator": "State Coordinator",
  "/register/telecommunicator": "Telecommunicator",
  "/visit": "Visit Follow-Up",
  "/patient-dashboard": "Patient Search",
  "/reports": "Reports",
  "/settings": "Settings",
  "/profile": "Profile",
};

const PageLayout = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
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
