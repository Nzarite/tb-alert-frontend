import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { MdLogout } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { updateLanguage } from "../redux/langSlice";
import "./Navbar.css";

const Navbar = () => {
  const language = useSelector((state: any) => state.language.language);
  const logout = useLogout();
  const dispatch = useDispatch();

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
          <MdLogout title="Log Out" size={25} onClick={logout} />
        </Link>
      </Box>
    </Box>
  );
};

export default Navbar;
