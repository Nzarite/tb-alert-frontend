import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Paper } from "@mui/material";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/axiosInstance";
import {
  FieldCoordinator,
  GPHead,
  StateHead,
  TeleCaller,
} from "../../components/datatypes/DataTypes";
import DeletePersonModal from "../../components/PatientDeletionModals/DeletePersonModal";
import UserDetailsModal from "./UserDetailsModal";
import UserPersonalDetails from "./UserPersonalDetails";

interface SearchProps {
  role: string;
}

const UserDashBoard = ({ role }: SearchProps) => {
  const { userId } = useParams<{ userId: string }>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<
    TeleCaller | StateHead | FieldCoordinator | GPHead | null
  >(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          role === "telecaller"
            ? `/telecaller/${userId}`
            : `/statehead/${userId}`;
        const response = await axiosInstance.get(url);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, role]);

  const handleUpdate = (updatedUser: TeleCaller | StateHead) => {
    setUserData(updatedUser);
  };

  let deleteUrl = "",
    navigateUrl = "",
    person = "";
  if (userData?.hasOwnProperty("stateHeadId")) {
    deleteUrl = `statehead/${userData?.stateHeadId}`;
    navigateUrl = "/user/statehead";
    person = "StateHead";
  } else if (userData?.hasOwnProperty("teleCallerId")) {
    deleteUrl = `telecaller/${userData?.teleCallerId}`;
    navigateUrl = "/user/telecaller";
    person = "TeleCaller";
  } else if (userData?.hasOwnProperty("fieldCoordinatorId")) {
    deleteUrl = `fieldcoordinator/${userData?.fieldCoordinatorId}`;
    navigateUrl = "/user/fieldcoordinator";
    person = "FieldCoordinator";
  } else if (userData?.hasOwnProperty("gpHeadId")) {
    deleteUrl = `gphead/${userData?.gpHeadId}`;
    navigateUrl = "/user/gphead";
    person = "GPHead";
  }

  const roles: string[] = useAuth().user?.profile.client_roles as string[];
  const canEdit = roles.includes("SuperAdmin");

  return (
    <div>
      <Paper sx={{ p: 3, height: "100%", overflowY: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <MdPerson style={{ fontSize: "24px" }} />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "#1976d2" }}
            >
              {role === "telecaller"
                ? "Telecaller Details"
                : "State Coordinator Details"}
            </Typography>
          </Box>

          {canEdit && (
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <DeleteIcon
                sx={{ cursor: "pointer" }}
                color="error"
                onClick={() => setDeleteModalOpen(true)}
              />

              <DeletePersonModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                deleteUrl={deleteUrl}
                navigateUrl={navigateUrl}
                person={person}
              />

              <RiPencilLine
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => setModalOpen(true)}
              />
            </Box>
          )}
        </Box>
        {userData && <UserPersonalDetails user={userData} />}
      </Paper>
      {modalOpen && (
        <UserDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={userData}
          role={role}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default UserDashBoard;
