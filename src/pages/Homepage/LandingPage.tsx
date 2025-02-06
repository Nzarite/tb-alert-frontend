import { Link } from "react-router-dom";
import "./styles.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="header-text">
        <h1 className="header-h1">Home</h1>
        <p className="header-p">Logged in as admin</p>
      </div>
      <div className="module-container">
        <Link to="/register/patient" className="module-item">
          <div>Register Patient</div>
        </Link>

        <Link to="#" className="module-item">
          <div>Register Caregiver</div>
        </Link>

        <Link to="/visit" className="module-item">
          <div>Follow-ups</div>
        </Link>

        <Link to="#" className="module-item">
          <div>Patient Dashboard</div>
        </Link>

        <Link to="/reports" className="module-item">
          <div>Patient Reports</div>
        </Link>

        <Link to="/settings" className="module-item">
          <div>Settings</div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
