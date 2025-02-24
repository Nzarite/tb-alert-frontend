import { Box } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Role } from "../../components/Authorization/Roles/Types";
import { tiles } from "../../components/Tiles";
import { RootState } from "../../redux/store";
import { setUserProfile } from "../../redux/userSlice";
import "./styles.css";

const LandingPage = () => {
  const auth = useAuth();
  console.log(auth);
  const user = auth?.user;
  const profile = user?.profile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      const userProfile = {
        exp: profile.exp,
        iat: profile.iat,
        iss: profile.iss,
        aud: profile.aud,
        sub: profile.sub,
        typ: profile.typ as string,
        sid: profile.sid,
        client_roles: profile.client_roles as object,
        email_verified: profile.email_verified,
        name: profile.name,
        preferred_username: profile.preferred_username,
        given_name: profile.given_name,
        family_name: profile.family_name,
        email: profile.email,
      };
      dispatch(setUserProfile(userProfile));
    }
  }, []);

  const state = useSelector((state: RootState) => state);
  console.log("Redux State:", state);

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
