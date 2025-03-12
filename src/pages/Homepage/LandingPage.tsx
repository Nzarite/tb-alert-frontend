import { Box } from "@mui/material";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { Role } from "../../components/Authorization/Roles/Types";
import { tiles } from "../../components/Tiles";
import "./styles.css";

const LandingPage = () => {
	const auth = useAuth();

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
