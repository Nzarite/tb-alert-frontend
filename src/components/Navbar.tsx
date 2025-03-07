import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  useMediaQuery,
} from "@mui/material";
import { MdLogout } from "react-icons/md";
import { RiAccountBoxFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Languages from "../components/Json/languages.json";
import useLogout from "../hooks/useLogout";
import { updateLanguage } from "../redux/langSlice";
import "./Navbar.css";

const Navbar = () => {
  const language = useSelector((state: any) => state.language.language);
  const logout = useLogout();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  return (
    <Box
      id="navbar"
      className={isMobile ? "mobile-navbar" : isTablet ? "tablet-navbar" : ""}
    >
      <Box className="navbar-left">
        <Link to="/" className="navbar-text">
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
            input={
              <OutlinedInput
                sx={{ height: "30px", fontSize: isMobile ? "12px" : "14px" }}
              />
            }
          >
            {Languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Link to="/profile" className="navbar-text">
          <RiAccountBoxFill title="Profile" size={isMobile ? 20 : 25} />
        </Link>
        <Box className="navbar-text">
          <MdLogout
            title="Log Out"
            size={isMobile ? 20 : 25}
            onClick={logout}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
