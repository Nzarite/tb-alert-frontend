import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PageLayout = () => {
  console.log("pagelayout");

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PageLayout;
