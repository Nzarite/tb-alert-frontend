import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import axiosInstance from "../../components/axiosInstance";
import { StateHead, TeleCaller } from "../../components/datatypes/DataTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema for validation
const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["Male", "Female"], { message: "Gender is required" }),
  state: z.string().min(2, "State must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  dateOfJoining: z.string({message:"Select Valid date of Joining"}),
  dateOfLeaving: z.string({message:"Select Valid date of leaving"}),
  createdBy:z.string()
});

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: TeleCaller | StateHead;
  role: string;
  onUpdate: (updatedUser: TeleCaller | StateHead) => void;
}

const UserDetailsModal = ({
  open,
  onClose,
  user,
  role,
  onUpdate,
}: UserDetailsModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user,
    mode:"all",
  });

  // Update form fields when user changes
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("gender", user.gender || "");
      setValue("state", user.state || "");
      setValue("phoneNumber", user.phoneNumber || "");
      setValue("dateOfJoining", user.dateOfJoining || "");
      setValue("dateOfLeaving", user.dateOfLeaving || "");
      setValue("createdBy",user.createdBy||"")
    }
  }, [user, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      const updateUrl =
        role === "telecaller"
          ? `/telecaller/update/${user.teleCallerId}`
          : `/statehead/update/${user.stateHeadId}`;

      const formattedData = {
        ...formData,
        
        createdBy:user.createdBy
      };

      const response = await axiosInstance.put(updateUrl, formattedData);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Edit User Details
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                defaultValue={user.gender}
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors.gender?.message}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                {...register("state")}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                {...register("phoneNumber")}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date of Joining"
                {...register("dateOfJoining")}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfJoining}
                helperText={errors.dateOfJoining?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date of Leaving"
                {...register("dateOfLeaving")}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfLeaving}
                helperText={errors.dateOfLeaving?.message}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Close
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UserDetailsModal;
