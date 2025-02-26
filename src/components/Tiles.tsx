import { FaUserPlus } from "react-icons/fa";
import { Role } from "./Authorization/Roles/Types";
import { IconType } from "react-icons";
import { AiFillSchedule } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";

export interface Tile {
  path: string;
  label: string;
  allowedRoles: Role[];
  Icon: IconType;
}

export const tiles: Tile[] = [
  {
    path: "/register/patient",
    label: "Register Patient",
    allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"],
    Icon: FaUserPlus,
  },
  {
    path: "/register/telecaller",
    label: "Register Telecaller",
    allowedRoles: ["SuperAdmin", "StateCoordinator"],
    Icon: FaUserPlus,
  },
  {
    path: "/register/statehead",
    label: "Register State Head",
    allowedRoles: ["SuperAdmin"],
    Icon: FaUserPlus,
  },
  {
    path: "/visit",
    label: "Visit Follow Up",
    allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"],
    Icon: AiFillSchedule,
  },
  {
    path: "/reports",
    label: "Reports",
    allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"],
    Icon: TbReportMedical,
  },
  {
    path: "/settings",
    label: "Settings",
    allowedRoles: ["SuperAdmin"],
    Icon: IoIosSettings,
  },
  {
    path: "/patient-dashboard",
    label: "Patient Dashboard",
    allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"],
    Icon: MdDashboard,
  },
  {
    path: "/user/telecaller",
    label: "Telecaller Dashboard",
    allowedRoles: ["StateCoordinator", "SuperAdmin"],
    Icon: MdDashboard,
  },
  {
    path: "/user/statehead",
    label: "State Coordinator Dashboard",
    allowedRoles: ["SuperAdmin"],
    Icon: MdDashboard,
  },
  {
    path: "/register/caregiver",
    label: "Register Caregiver",
    allowedRoles: ["SuperAdmin", "StateCoordinator", "Telecaller"],
    Icon: FaUserPlus,
  },
];
