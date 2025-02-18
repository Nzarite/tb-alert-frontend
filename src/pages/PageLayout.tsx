import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PageLayout = () => {
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
