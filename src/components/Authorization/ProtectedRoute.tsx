import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps, Role } from "./Roles/Types";
import { useAuth } from "react-oidc-context";


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  const userRoles: Role[] = (user?.profile?.client_roles || []) as Role[];

  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
