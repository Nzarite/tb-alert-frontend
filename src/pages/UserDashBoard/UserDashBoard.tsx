import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Paper } from "@mui/material";
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
        const url = `/${role}/${userId}`;
        const response = await axiosInstance.get(url);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, role]);

  const handleUpdate = (
    updatedUser: TeleCaller | StateHead | FieldCoordinator | GPHead
  ) => {
    setUserData(updatedUser);
  };

  let deleteUrl = "",
    navigateUrl = "",
    person = "";
  if (role === "statehead") {
    deleteUrl = `statehead/${userData?.stateHeadId}`;
    navigateUrl = "/user/statehead";
    person = "StateHead";
  } else if (role === "telecaller") {
    deleteUrl = `telecaller/${userData?.teleCallerId}`;
    navigateUrl = "/user/telecaller";
    person = "TeleCaller";
  } else if (role === "fieldcoordinator") {
    deleteUrl = `fieldcoordinator/${userData?.id}`;
    navigateUrl = "/user/fieldcoordinator";
    person = "FieldCoordinator";
  } else if (role === "gphead") {
    deleteUrl = `gphead/${userData?.id}`;
    navigateUrl = "/user/gphead";
    person = "GPHead";
  }

  const roles: string[] = useAuth().user?.profile.client_roles as string[];
  const isAdmin = roles.includes("SuperAdmin");

  const getTitle = (role: string) => {
    switch (role) {
      case "telecaller":
        return "Telecaller Details";
      case "statehead":
        return "Statehead Details";
      case "fieldcoordinator":
        return "Field Coordinator Details";
      case "gphead":
        return "GP Head details";
    }
  };

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
              {getTitle(role)}
            </Typography>
          </Box>

          {isAdmin && (
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <IconButton>
                <DeleteIcon
                  sx={{ cursor: "pointer" }}
                  color="error"
                  onClick={() => setDeleteModalOpen(true)}
                />
              </IconButton>

              <DeletePersonModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                deleteUrl={deleteUrl}
                navigateUrl={navigateUrl}
                person={person}
              />

              <IconButton>
                <RiPencilLine
                  color="black"
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => setModalOpen(true)}
                />
              </IconButton>
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
