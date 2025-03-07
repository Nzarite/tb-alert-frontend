export type Role =
  | "SuperAdmin"
  | "StateCoordinator"
  | "Telecaller"
  | "FieldCoordinator"
  | "GpHead";

export interface ProtectedRouteProps {
  allowedRoles: Role[];
}
