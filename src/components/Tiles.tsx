import { FaUser } from "react-icons/fa";
import { Role } from "./Authorization/Roles/Types";
import { IconType } from "react-icons";
import { AiFillSchedule } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";



export interface Tile {
  path: string;
  label: string;
  allowedRoles: Role[],
  Icon: IconType; 
}

export const tiles: Tile[] = [
  { path: "/register/patient", label: "Register Patient", allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"], Icon: FaUser },
  { path: "/register/caregiver", label: "Register Caregiver", allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"], Icon: FaUser },
  { path: "/visit", label: "Visit Follow Up", allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"], Icon: AiFillSchedule },
  { path: "/dashboard/patient", label: "Patient Dashboard", allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"], Icon: MdDashboard },
  { path: "/reports", label: "Reports", allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"], Icon: TbReportMedical },

  { path: "/register/telecommunicator", label: "Register TeleCommunicator", allowedRoles: ["SuperAdmin", "StateCoordinator"], Icon: FaUser },

  { path: "/register/state-coordinator", label: "Register State Coordinator", allowedRoles: ["SuperAdmin"], Icon: FaUser },
  { path: "/settings", label: "Settings", allowedRoles: ["SuperAdmin"], Icon: IoIosSettings },

];
