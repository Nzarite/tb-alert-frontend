import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "react-oidc-context";

const Navbar = () => {
  const auth = useAuth();

  const [language, setLanguage] = useState("English");
  return (
    <div id="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-text">
          TB Alert
        </Link>
      </div>
      <div className="navbar-right">
        <FormControl id="language-menu">
          <Select
            labelId="language-type-label"
            label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hin">Hindi</MenuItem>
            <MenuItem value="tel">Telugu</MenuItem>
          </Select>
        </FormControl>

        <Link to="#" className="navbar-text">
          <RiAccountBoxFill title="Profile" size={25} />
        </Link>
        <Link to="#" className="navbar-text">
          <MdLogout
            title="Log Out"
            size={25}
            onClick={() => auth.signoutRedirect()}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
