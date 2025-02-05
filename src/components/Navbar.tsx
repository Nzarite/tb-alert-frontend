import { MdLogout } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div id="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-text">
          TB Alert
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="#" className="navbar-text">
          <RiAccountBoxFill title="Profile" size={25} />
        </Link>
        <Link to="#" className="navbar-text">
          <MdLogout title="Log Out" size={25} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
