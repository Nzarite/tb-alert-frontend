import { Link } from "react-router-dom";
import "./styles.css";
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";
import { AiFillSchedule } from "react-icons/ai";
import { Box } from "@mui/material";

const LandingPage = () => {
  return (
    <Box className="landing-container">
      <Box className="module-container">
        <Link to="/register/patient" className="module-item">
          <FaUser className="icon"/>
          <Box>Register Patient</Box>
        </Link>

        <Link to="register/caregiver" className="module-item">
          <FaUser className="icon"/>
          <Box>Register Caregiver</Box>
        </Link>

        <Link to="/visit" className="module-item">
          <AiFillSchedule className="icon"/>
          <Box>Follow-ups</Box>
        </Link>

        <Link to="dashboard/patient" className="module-item">
          <MdDashboard className="icon"/>
          <Box>Patient Dashboard</Box>
        </Link>

        <Link to="/reports" className="module-item">
        <TbReportMedical className="icon"/>
          <Box>Reports</Box>
        </Link>

        <Link to="/settings" className="module-item">
          <IoIosSettings className="icon" /> 
          <Box>Settings</Box>
        </Link>

        <Link to="/register/state-coordinator" className="module-item">
          <FaUser className="icon"/>
          <Box>Register State <br />Coordinator</Box>
        </Link>

        <Link to="/register/telecommunicator" className="module-item">
          <FaUser className="icon"/>
          <Box>Register Tele Communicator</Box>
        </Link>
      </Box>
    </Box>
  );
};

export default LandingPage;
