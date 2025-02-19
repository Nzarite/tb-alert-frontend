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
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
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
  district: z.string().min(1, "District Name is required"),
  village: z.string().min(1, "Village Name is required"),
  block: z.string().min(1, "Block Name is required"),
  gp: z.string().min(1, "GP Name is required"),
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
      name: "dateOfBirth",
      label: "Date of Birth",
      placeholder: "Date of Birth",
      type: "date",
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
        { label: "Telangana", value: "TG" },
        { label: "Uttar Pradesh", value: "UP" },
        { label: "Bihar", value: "BR" },
      ],
      disabled: loading,
    },
    {
      name: "district",
      label: "District",
      placeholder: "Enter District Name",
      type: "text",
      disabled: loading,
    },
    {
      name: "village",
      label: "Village",
      placeholder: "Enter Village Name",
      type: "text",
      disabled: loading,
    },
    {
      name: "block",
      label: "Block",
      placeholder: "Enter Block name",
      type: "text",
      disabled: loading,
    },
    {
      name: "gp",
      label: "GP",
      placeholder: "Enter GP name",
      type: "text",
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
        height: "90vh",
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
            <Button onClick={() => reset()} color="inherit" disabled={loading}>
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
    </Paper>
  );
};

export default TeleCommunicationRegistration;
