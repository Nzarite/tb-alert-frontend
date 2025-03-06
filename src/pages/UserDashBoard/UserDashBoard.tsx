import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserPersonalDetails from "./UserPersonalDetails";
import { Paper, Box } from "@mui/material";
import { Typography } from "antd";
import { RiPencilLine } from "react-icons/ri";
import { MdPerson } from "react-icons/md";
import UserDetailsModal from "./UserDetailsModal";
import { StateHead, TeleCaller } from "../../components/datatypes/DataTypes";
import axiosInstance from "../../components/axiosInstance";
import DeletePersonModal from "../../components/PatientDeletionModals/DeletePersonModal";

interface SearchProps {
  role: string;
}

const UserDashBoard = ({ role }: SearchProps) => {
  const { userId } = useParams<{ userId: string }>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<TeleCaller | StateHead | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = role === "telecaller" ? `/telecaller/${userId}` : `/statehead/${userId}`;
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

  const isStateHead = userData?.hasOwnProperty("stateHeadId");
  const deleteUrl = isStateHead
    ? `statehead/${userData?.stateHeadId}`
    : `telecaller/${userData?.teleCallerId}`;
  const navigateUrl = isStateHead ? "/user/statehead" : "/user/telecaller";
  const person = isStateHead ? "StateHead" : "TeleCaller";

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
