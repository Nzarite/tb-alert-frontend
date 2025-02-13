export type Role = "SuperAdmin" | "StateCoordinator" | "Telecaller";


export interface ProtectedRouteProps {
  allowedRoles: Role[];
}
