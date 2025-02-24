import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserPersonalDetails from "./UserPersonalDetails";
import { Paper, Box } from "@mui/material";
import { Typography } from "antd";
import { RiPencilLine } from "react-icons/ri";
import { MdPerson } from "react-icons/md";
import UserDetailsModal from "./UserDetailsModal";
import { StateHead, TeleCaller } from "../../components/datatypes/DataTypes";
import axiosInstance from "../../components/axiosInstance";

interface SearchProps {
  role: string;
}

const UserDashBoard = ({ role }: SearchProps) => {
  const { userId } = useParams<{ userId: string }>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<TeleCaller | StateHead | null>(null);

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

  return (
    <div>
      <Paper sx={{ p: 3, height: "100%", overflowY: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <MdPerson style={{ fontSize: "24px" }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1976d2" }}>
              {role==="telecaller"?"Telecaller Details":"State Coordinator Details"}
            </Typography>
          </Box>
          <RiPencilLine
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => setModalOpen(true)}
          />
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
