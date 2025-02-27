import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { StateHead, TeleCaller } from "../../components/datatypes/DataTypes";
import DeletePersonModal from "../../components/PatientDeletionModals/DeletePersonModal";
import { renderField } from "../PatientDashboard/PatientNikshayDetails";

interface SearchProps {
  user: TeleCaller | StateHead;
}

const UserPersonalDetails = ({ user }: SearchProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  let fields = [
    {
      name: user.hasOwnProperty("stateHeadId") ? "stateHeadId" : "teleCallerId",
      label: "User ID",
      size: 12,
    },
    { name: "firstName", label: "First Name", size: 6 },
    { name: "lastName", label: "Last Name", size: 6 },
    { name: "gender", label: "Gender", size: 6 },
    { name: "state", label: "State", size: 6 },
    { name: "phoneNumber", label: "Contact", size: 6 },
    { name: "dateOfJoining", label: "Date of Joining", size: 6 },
    { name: "email", label: "Email", size: 6 },
    { name: "dateOfLeaving", label: "Date of Leaving", size: 6 },
  ];

  const isStateHead = user.hasOwnProperty("stateHeadId");
  const deleteUrl = isStateHead
    ? `statehead/${user?.stateHeadId}`
    : `telecaller/${user?.teleCallerId}`;
  const navigateUrl = isStateHead ? "/user/statehead" : "/user/telecaller";
  const person = isStateHead ? "StateHead" : "TeleCaller";

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          pr: 2,
        }}
      >
        <Button
          color="error"
          variant="contained"
          onClick={() => setDeleteModalOpen(true)}
        >
          <DeleteIcon />
        </Button>

        <DeletePersonModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          deleteUrl={deleteUrl}
          navigateUrl={navigateUrl}
          person={person}
        />
      </Box>
      <Divider sx={{ mb: 4 }} />
      {user ? (
        <Grid container spacing={3} sx={{ padding: "0px 40px" }}>
          {fields.map((item, index) => renderField(user, item, index))}
        </Grid>
      ) : (
        <Typography align="center" variant="body2" color="textSecondary">
          Unable to fetch data
        </Typography>
      )}
    </>
  );
};

export default UserPersonalDetails;
