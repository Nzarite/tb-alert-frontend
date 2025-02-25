import { Box } from "@mui/material";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../Homepage/styles.css";

const RegisterWrapper = () => {
  return (
    <Box className="landing-container">
      <Box className="module-container">
        <Link to="/register/patient" className="module-item">
          <FaUser className="icon" />
          <Box>Register Patient</Box>
        </Link>

        <Link to="caregiver" className="module-item">
          <FaUser className="icon" />
          <Box>Register Caregiver</Box>
        </Link>

        <Link to="/register/state-coordinator" className="module-item">
          <FaUser className="icon" />
          <Box>
            Register State <br />
            Coordinator
          </Box>
        </Link>

        <Link to="/register/telecommunicator" className="module-item">
          <FaUser className="icon" />
          <Box>Register Tele Communicator</Box>
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterWrapper;
