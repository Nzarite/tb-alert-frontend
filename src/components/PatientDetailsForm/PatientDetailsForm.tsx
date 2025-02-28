import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { Role } from "../Authorization/Roles/Types";
import { useAuth } from "react-oidc-context";

export type PatientDetailsData = {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  age: number;
  state: string;
  district: string;
  village: string;
  block: string;
  gp: string;
  consentForMessage: boolean;
};

const patientDetailsSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  gender: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only numbers")
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number can't exceed 15 digits"),
  age: z
    .number()
    .int("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(150, "Age must be at most 150"),
  state: z.string().min(1, "State Name is required"),
  district: z.string().min(1, "District Name is required"),
  village: z.string().min(1, "Village Name is required"),
  block: z.string().min(1, "Block Name is required"),
  gp: z.string().min(1, "GP Name is required"),
  consentForMessage: z.string(),
});

const PatientDetailsForm = ({
  language,
  data,
  onSave,
  // onNext,
  functionality,
  loading,
}: any) => {
  interface LabelOption {
    label: string;
    options: { label: string; value: any }[];
  }

  const [state, setState] = useState<{ states: LabelOption }>({
    states: { label: "", options: [] },
  });

  const auth = useAuth();

  const userState =
    useSelector((state: any) => state.userState) ||
    localStorage.getItem("userState");

  const userRoles: Role[] = useSelector(
    (state: any) =>
      state.user?.profile?.client_roles || auth?.user?.profile?.client_roles
  ) as Role[];

  interface PatientDetailsFormLabelsData {
    firstNameLabel: string;
    lastNameLabel: string;
    genderLabel: LabelOption;
    phoneNumberLabel: string;
    ageLabel: string;
    districtLabel: string;
    villageLabel: string;
    blockLabel: string;
    gpLabel: string;
    consentForMessageLabel: LabelOption;
  }

  const [labels, setLabels] = useState<PatientDetailsFormLabelsData>({
    firstNameLabel: "",
    lastNameLabel: "",
    genderLabel: { label: "", options: [] },
    phoneNumberLabel: "",
    ageLabel: "",
    districtLabel: "",
    villageLabel: "",
    blockLabel: "",
    gpLabel: "",
    consentForMessageLabel: { label: "", options: [] },
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form1_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.patientdetailsform))
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useForm<PatientDetailsData>({
    defaultValues: data || {},
    resolver: zodResolver(patientDetailsSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key as keyof PatientDetailsData, data[key]);
      });
    }
  }, [data, setValue]);

  const onSubmit = (stepData: PatientDetailsData) => {
    onSave(stepData);
    // if (functionality !== "editdetails") {
    //   onNext();
    // }
  };

  const formFields: {
    name: keyof PatientDetailsData;
    type: "text" | "select" | "date" | "radio" | "number";
    label: string;
    options?: { label: string; value: string }[];
  }[] = [
    { name: "firstName", type: "text", label: labels.firstNameLabel },
    { name: "lastName", type: "text", label: labels.lastNameLabel },
    {
      name: "gender",
      type: "radio",
      label: labels.genderLabel.label,
      options: labels.genderLabel.options,
    },
    { name: "phoneNumber", type: "text", label: labels.phoneNumberLabel },
    { name: "age", type: "number", label: labels.ageLabel },
    {
      name: "state",
      type: "select",
      label: state.states.label,
      options: userRoles.includes("SuperAdmin")
        ? state.states.options
        : state.states.options.filter((option) => option.value === userState),
    },
    { name: "district", type: "text", label: labels.districtLabel },
    { name: "village", type: "text", label: labels.villageLabel },
    { name: "block", type: "text", label: labels.blockLabel },
    { name: "gp", type: "text", label: labels.gpLabel },
    {
      name: "consentForMessage",
      type: "radio",
      label: labels.consentForMessageLabel.label,
      options: labels.consentForMessageLabel.options,
    },
  ];

  // const len = {
  //   name: "state",
  //   type: "select",
  //   label: state.states.label,
  //   options: userRoles.includes("SuperAdmin")
  //     ? state.states.options
  //     : state.states.options.filter((option) => option.value === userState),
  // }.options.length;

  // console.log(len);

  if (!labels || !state.states) return <CircularProgress />;

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6">Patient Details</Typography>
        {formFields.map((field) =>
          field.type === "text" || field.type === "date" ? (
            <TextField
              key={field.name}
              {...register(field.name)}
              label={field.label}
              type={field.type}
              variant="outlined"
              fullWidth
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              disabled={loading}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message}
            />
          ) : field.type === "select" ? (
            <Controller
              name={field.name}
              control={control}
              defaultValue={data?.[field.name] || ""}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  select
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
                  // value={
                  //   field.options?.length === 1
                  //     ? field.options[0].value
                  //     : controllerField.value || ""
                  // }
                  onChange={(e) => controllerField.onChange(e.target.value)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          ) : field.type === "radio" ? (
            <FormControl
              key={field.name}
              margin="normal"
              disabled={loading}
              error={!!errors[field.name]}
            >
              <FormLabel>{field.label}</FormLabel>
              <Controller
                name={field.name}
                control={control}
                defaultValue={data?.name || ""}
                rules={{ required: `${field.label} is required` }}
                render={({ field: radioField }) => (
                  <RadioGroup {...radioField} row>
                    {field.options?.map((option) => (
                      <FormControlLabel
                        key={option.value.toString()}
                        value={option.value.toString()}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          ) : field.type === "number" ? (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  slotProps={{ inputLabel: { shrink: true } }}
                  disabled={loading}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  onChange={(e) =>
                    controllerField.onChange(Number(e.target.value) || "")
                  }
                />
              )}
            />
          ) : null
        )}
        <Box mt={3}>
          {functionality === "register" && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save and Next"
              )}
            </Button>
          )}
          {functionality === "editdetails" && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default PatientDetailsForm;
