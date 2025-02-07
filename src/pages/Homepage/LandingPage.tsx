import { Link } from "react-router-dom";
import "./styles.css";
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";
import { AiFillSchedule } from "react-icons/ai";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* <div className="header-text">
        <h1 className="header-h1">Home</h1>
        <p className="header-p">Logged in as admin</p>
      </div> */}
      <div className="module-container">
        <Link to="/register/patient" className="module-item">
          <FaUser size={30}/>
          <div>Register <br /> Patient</div>
        </Link>

        <Link to="#" className="module-item">
          <FaUser size={30}/>
          <div>Register <br /> Caregiver</div>
        </Link>

        <Link to="/visit" className="module-item">
          <AiFillSchedule size={40}/>
          <div>Follow-ups</div>
        </Link>

        <Link to="#" className="module-item">
          <MdDashboard size={30}/>
          <div>Patient <br /> Dashboard</div>
        </Link>

        <Link to="/reports" className="module-item">
        <TbReportMedical size={40}/>
          <div>Reports</div>
        </Link>

        <Link to="/settings" className="module-item">
          <IoIosSettings size={40} /> 
          <div>Settings</div>
        </Link>

        <Link to="/register/state-coordinator" className="module-item">
          <FaUser size={25}/>
          <div>Register <br /> State <br />Coordinator</div>
        </Link>

        <Link to="/register/telecommunicator" className="module-item">
          <FaUser size={25}/>
          <div>Register <br /> Tele <br /> Communicator</div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
