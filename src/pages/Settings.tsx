import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Settings = () => {

  return <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 3,
      width: "80vw",
      margin: "0 auto",
      mt: 10,
    }}
  >
    <Typography variant="h5">Settings</Typography>
    <Box 
    sx={{
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      gap: 1
    }}
    >
      <Link to="smsReminders">SMS Reminders</Link>
      <Link to="smsTemplates">SMS Templates</Link>
      <Link to="followUps">Follow Ups</Link>
      <Link to="modifyStates">Add/Remove States</Link>
      

    </Box>
  </Box>
};

export default Settings;