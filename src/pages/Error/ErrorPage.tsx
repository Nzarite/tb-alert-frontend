import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
        height: "84vh",
      }}
    >
      <Typography align="center" variant="h5">
        Page you're looking for does not exist
      </Typography>
      <Link to={"/"}>
        <Button variant="contained">Redirect to Home</Button>
      </Link>
    </Box>
  );
};

export default ErrorPage;
