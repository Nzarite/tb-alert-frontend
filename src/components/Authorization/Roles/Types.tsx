export type Role =
  | "SuperAdmin"
  | "StateCoordinator"
  | "Telecaller"
  | "FieldCoordinator"
  | "GPHead";

export interface ProtectedRouteProps {
  allowedRoles: Role[];
}
