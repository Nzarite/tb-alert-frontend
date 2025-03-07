import { Box, Button, Modal, Typography } from "@mui/material";

const LogOutModal = ({ open, onClose, onConfirm }: any) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Confirm Logout</Typography>
        <Typography variant="body1" sx={{ m: 2 }}>
          Are you sure you want to logout?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LogOutModal;
