import { Divider, Grid, Typography } from "@mui/material";
import { StateHead, TeleCaller } from "../../components/datatypes/DataTypes";
import { renderField } from "../PatientDashboard/PatientNikshayDetails";

interface SearchProps {
  user: TeleCaller | StateHead;
}

const UserPersonalDetails = ({ user }: SearchProps) => {
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
  return (
    <>
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
