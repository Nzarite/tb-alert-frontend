import { Box, Button, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

const DeletePersonModal = ({
  open,
  onClose,
  deleteUrl,
  navigateUrl,
  person,
}: any) => {
  const navigate = useNavigate();
  const onConfirm = async () => {
    try {
      await axiosInstance.delete(deleteUrl);
      navigate(navigateUrl);
      toast.success(`${person} deleted successfully`);
    } catch (Error) {
      toast.error(`Failed to delete ${person}. Please try again`);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this {person}?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DeletePersonModal;
