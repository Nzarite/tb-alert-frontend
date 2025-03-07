import { Box } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Role } from "../../components/Authorization/Roles/Types";
import axiosInstance from "../../components/axiosInstance";
import { tiles } from "../../components/Tiles";
import {
  setUserProfile,
  setUserState,
  UserProfile,
} from "../../redux/userSlice";
import "./styles.css";

const LandingPage = () => {
	const auth = useAuth();
	const user = auth?.user;
  const profile = user?.profile;
  console.log(profile);
	const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      const userProfile = profile as unknown as UserProfile;
      dispatch(setUserProfile(userProfile));

      const fetchUserDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/person/email/${profile.email}`
          );

          if (response.data.state) {
            dispatch(setUserState(response.data.state));
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [profile, dispatch]);

	const userRoles: Role[] = (auth?.user?.profile?.client_roles || []) as Role[];

  const accessibleTiles = tiles.filter((tile) =>
    tile.allowedRoles.some((role) => userRoles.includes(role))
  );

  return (
    <Box className="landing-container">
      <Box className="module-container">
        {accessibleTiles.map(({ path, label, Icon }) => (
          <Link key={path} to={path} className="module-item">
            <Icon className="icon" />
            <Box>{label}</Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default LandingPage;
