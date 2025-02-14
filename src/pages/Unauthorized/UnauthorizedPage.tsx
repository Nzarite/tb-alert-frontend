import {Box, Typography} from "@mui/material";

const UnauthorizedPage = () => {
    return (
      <Box>
        <Typography variant="h5" color="red">
          Access Denied!
        </Typography>

        <Typography>
          You do not have the required permissions to view this page
        </Typography>
      </Box> 
    );
  };
  
  export default UnauthorizedPage;
  