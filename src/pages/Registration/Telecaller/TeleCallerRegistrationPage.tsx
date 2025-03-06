import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { Role } from "../../../components/Authorization/Roles/Types";
import FormFieldRenderer from "../../../components/FormFieldRender";
import axiosInstance from "../../../components/axiosInstance";
import { LabelOption } from "../../../components/datatypes/DataTypes";
import { ScTcRegistrationFormLabelsData } from "../StateHead/StateHeadRegistrationPage";

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
});

type FormData = z.infer<typeof schema>;

const TelecallerRegistrationPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const userEmail =
    useSelector((state: any) => state.user?.profile?.email) ||
    auth.user?.profile?.email;

  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const [state, setState] = useState<{ states: LabelOption }>({
    states: { label: "", options: [] },
  });

  const [labels, setLabels] = useState<ScTcRegistrationFormLabelsData>({
    userIdLabel: "",
    firstNameLabel: "",
    lastNameLabel: "",
    genderLabel: { label: "", options: [] },
    phoneNumberLabel: "",
    emailLabel: "",
    dateOfJoiningLabel: "",
    dateOfLeavingLabel: "",
    stateLabel: "",
  });

  const language = useSelector((state: any) => state.language.language);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userState =
    useSelector((state: any) => state.userState) ||
    localStorage.getItem("userState");

  const userRoles: Role[] = useSelector(
    (state: any) =>
      state.user?.profile?.client_roles || auth?.user?.profile?.client_roles
  ) as Role[];

  useEffect(() => {
    fetch(`/locales/sc_tc_registration_form_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.scandtcregistrationform))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  useEffect(() => {
    fetch(`/locales/states_${language}.json`)
      .then((response) => response.json())
      .then((data) => setState(data))
      .catch((err) => {
        console.error("Error fetching states:", err);
        alert("Failed to load states data. Please try again.");
      });
  }, [language]);

  const formFields = [
    {
      name: "firstName",
      label: labels.firstNameLabel,
      type: "text",
      disabled: loading,
    },
    {
      name: "lastName",
      label: labels.lastNameLabel,
      type: "text",
      disabled: loading,
    },
    {
      name: "gender",
      label: labels.genderLabel.label,
      options: labels.genderLabel.options,
      type: "select",
      disabled: loading,
    },
    {
      name: "phoneNumber",
      label: labels.phoneNumberLabel,
      type: "text",
      disabled: loading,
    },
    {
      name: "email",
      label: labels.emailLabel,
      type: "text",
      disabled: loading,
    },
    {
      name: "dateOfJoining",
      label: labels.dateOfJoiningLabel,
      type: "date",
      disabled: loading,
    },
    {
      name: "state",
      label: state.states.label,
      options: userRoles.includes("SuperAdmin")
        ? state.states.options
        : state.states.options.filter((option) => option.value === userState),
      type: "select",
      disabled: loading,
    },
  ];

  const formSubmitHandler = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);
    const formData = { ...data, createdBy: userEmail };
    try {
      await axiosInstance.post("/telecaller/register", formData);
      navigate("/");
      toast.success(
        "The person has been registered successfully as a Telecaller. An email has been sent for password reset.",
        { autoClose: 5000 }
      );
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
        Register Telecaller
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
    </Paper>
  );
};

export default TelecallerRegistrationPage;
