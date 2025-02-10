import { Link } from "react-router-dom";
import "./styles.css";
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";
import { AiFillSchedule } from "react-icons/ai";
import { Box, Typography } from "@mui/material";

const LandingPage = () => {
  return (
    <Box className="landing-container">
      <Box className="module-container">
        <Link to="/register/patient" className="module-item">
          <FaUser className="icon" size={35}/>
          <Box>Register <br /> Patient</Box>
        </Link>

        <Link to="#" className="module-item">
          <FaUser className="icon" size={35}/>
          <Box>Register <br /> Caregiver</Box>
        </Link>

        <Link to="/visit" className="module-item">
          <AiFillSchedule className="icon" size={35}/>
          <Box>Follow-ups</Box>
        </Link>

        <Link to="#" className="module-item">
          <MdDashboard className="icon" size={35}/>
          <Box>Patient <br /> Dashboard</Box>
        </Link>

        <Link to="/reports" className="module-item">
        <TbReportMedical className="icon" size={35}/>
          <Box>Reports</Box>
        </Link>

        <Link to="/settings" className="module-item">
          <IoIosSettings className="icon" size={35} /> 
          <Box>Settings</Box>
        </Link>

        <Link to="/register/state-coordinator" className="module-item">
          <FaUser className="icon" size={35}/>
          <Box>Register <br /> State <br />Coordinator</Box>
        </Link>

        <Link to="/register/telecommunicator" className="module-item">
          <FaUser className="icon" size={35}/>
          <Box>Register <br /> Tele <br /> Communicator</Box>
        </Link>
      </Box>
    </Box>
  );
};

export default LandingPage;
