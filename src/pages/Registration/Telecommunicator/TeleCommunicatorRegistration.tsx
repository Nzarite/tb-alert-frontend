import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import FormFieldRenderer from "../../../components/FormFieldRender";
import StateData from "../../../components/Json/states.json";
import axiosInstance from "../../../components/axiosInstance";

const schema = z.object({
  firstName: z.string().min(1, "First name can't be empty"),
  lastName: z.string(),
  gender: z.string().nonempty("Please select a Gender"),
  phoneNumber: z
    .string()
    .nonempty("Contact can't be empty")
    .regex(/^\d+$/, "Contact must contain only numbers")
    .min(10, "Contact must be 10 digits"),
  email: z.string().email("Please enter a valid email"),
  dateOfJoining: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  state: z.string().nonempty("Please select a state"),
  createdBy: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof schema>;

const TeleCommunicationRegistration = () => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formFields = [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Enter First Name",
      type: "text",
      disabled: loading,
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter Last Name",
      type: "text",
      disabled: loading,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" },
      ],
      disabled: loading,
    },
    {
      name: "phoneNumber",
      label: "Contact",
      placeholder: "Enter Phone Number",
      type: "text",
      disabled: loading,
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      type: "text",
      disabled: loading,
    },
    {
      name: "dateOfJoining",
      label: "Date of Joining",
      placeholder: "Date of Joining",
      type: "date",
      disabled: loading,
    },
    // {
    //   name: "state",
    //   label: "State",
    //   value: StateData[0].value,
    //   type: "select",
    //   options: StateData,
    //   disabled: true,
    // },
    {
      name: "state",
      label: "State",
      type: "select",
      options: [
        { label: "Telangana", value: "TELANGANA" },
        { label: "Uttar Pradesh", value: "UTTAR PRADESH" },
        { label: "Bihar", value: "BIHAR" },
      ],
      disabled: loading,
    },
    {
      name: "createdBy",
      label: "Email of person created by",
      placeholder: "Email of person created by",
      type: "text",
      disabled: loading,
    },
  ];

  const formSubmitHandler = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);
    const formData = { ...data };
    console.log("Submitted Data: ", data);
    try {
      await axiosInstance.post("/telecaller/register", formData);
      setOpenSnackbar(true);
      reset();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ||
          "There was an error submitting the form, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        height: "85vh",
        overflow: "auto",
        padding: 4,
        width: "40vw",
        margin: "30px auto 0px auto",
      }}
    >
      <Typography variant="h5" sx={{ margin: "0px auto 15px auto" }}>
        Register TeleCommunicator
      </Typography>
      <Divider sx={{ marginBottom: "30px" }} />
      <Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
        <Stack spacing={3}>
          {formFields.map((field) => (
            <FormFieldRenderer
              key={field.name}
              field={field}
              control={control}
              errors={errors}
            />
          ))}
          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: "15px" }}>
              {errorMessage}
            </Alert>
          )}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button
              onClick={() => {
                reset(
                  {},
                  { keepErrors: false, keepDirty: false, keepTouched: false }
                );
              }}
              color="inherit"
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Stack>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
        >
          The person has been registered successfully as a Telecaller. An email
          has been sent for password reset.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TeleCommunicationRegistration;
