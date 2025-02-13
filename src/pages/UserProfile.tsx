import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const UserProfile = () => {
  const profile = useSelector((state: RootState) => state.user.profile);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10vh",
      }}
    >
      <Typography variant="h4">Your Profile</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          marginTop: "5vh",
        }}
      >
        <Typography variant="h5">Name: {profile?.name}</Typography>
      </Box>
    </Box>
  );
};

export default UserProfile;
