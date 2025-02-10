import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container, Box, Typography, TextField, Button } from "@mui/material";

const caregiverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactDetails: z.string().min(1, "Contact details are required"),
  relationship: z.string().min(1, "Relationship with patient is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
});

type CaregiverFormData = z.infer<typeof caregiverSchema>;

function CaregiverRegistrationForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverSchema),
    defaultValues: {
      name: "",
      contactDetails: "",
      relationship: "",
      emergencyContact: "",
    },
  });

  const onSubmit = (data: CaregiverFormData) => {
    console.log("Caregiver Data Submitted:", data);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Caregiver Registration
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="contactDetails"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Details"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.contactDetails}
                helperText={errors.contactDetails?.message}
              />
            )}
          />

          <Controller
            name="relationship"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Relationship with Patient"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.relationship}
                helperText={errors.relationship?.message}
              />
            )}
          />

          <Controller
            name="emergencyContact"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Emergency Contact"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.emergencyContact}
                helperText={errors.emergencyContact?.message}
              />
            )}
          />

          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary">
              Register Caregiver
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default CaregiverRegistrationForm;
