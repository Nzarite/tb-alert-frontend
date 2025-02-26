import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "react-oidc-context";
import { useDispatch } from "react-redux";
import { clearUserProfile, userSlice } from "../redux/userSlice";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState("en");
  const logout = useLogout();

  return (
    <Box id="navbar">
      <Box className="navbar-left">
        <Link to="/" className="navbar-text app-logo">
          TB Alert
        </Link>
      </Box>
      <Box className="navbar-right">
        <FormControl id="language-menu">
          <Select
            labelId="language-type-label"
            label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            input={<OutlinedInput sx={{ height: "30px" }} />}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="te">Telugu</MenuItem>
          </Select>
        </FormControl>

        <Link to="/profile" className="navbar-text">
          <RiAccountBoxFill title="Profile" size={25} />
        </Link>
        <Link to="#" className="navbar-text">
          <MdLogout title="Log Out" size={25} onClick={logout} />
        </Link>
      </Box>
    </Box>
  );
};

export default Navbar;
