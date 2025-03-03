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
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { updateLanguage } from "../redux/langSlice";
import LogOutModal from "./Modal/LogOutModal";
import "./Navbar.css";

const Navbar = () => {
  const language = useSelector((state: any) => state.language.language);
  const logout = useLogout();
  const dispatch = useDispatch();
  const [logoutModalOpen, setlogOutModalOpen] = useState(false);

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
            onChange={(e) => {
              dispatch(updateLanguage(e.target.value));
            }}
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
          <MdLogout
            title="Log Out"
            size={25}
            onClick={() => setlogOutModalOpen(true)}
          />
        </Link>

        <LogOutModal
          open={logoutModalOpen}
          onClose={() => setlogOutModalOpen(false)}
          onConfirm={logout}
        />
      </Box>
    </Box>
  );
};

export default Navbar;
