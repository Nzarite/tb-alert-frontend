import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  Paper,
  MenuItem,
  LabelDisplayedRowsArgs,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type PatientDetailsData = {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  dateOfBirth: string;
  stateName: string;
  district: string;
  village: string;
  block: string;
  gp: string;
};

const patientDetailsSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  gender: z.enum(["M", "F"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  phone: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only numbers")
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number can't exceed 15 digits"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  stateName: z.string().min(1, "State Name is required"),
  district: z.string().min(1, "District Name is required"),
  village: z.string().min(1, "Village Name is required"),
  block: z.string().min(1, "Block Name is required"),
  gp: z.string().min(1, "GP Name is required"),
});

const PatientDetailsForm = ({ language, data, onSave, onNext }: any) => {
  interface LabelOption {
    label: string;
    options: { label: string; value: any }[];
  }

  const [state, setState] = useState<{ states: LabelOption }>({
    states: { label: "", options: [] },
  });

  interface PatientDetailsFormLabelsData {
    firstNameLabel: string;
    lastNameLabel: string;
    genderLabel: LabelOption;
    phoneLabel: string;
    dateOfBirthLabel: string;
    districtLabel: string;
    villageLabel: string;
    blockLabel: string;
    gpLabel: string;
  }

  const [labels, setLabels] = useState<PatientDetailsFormLabelsData>({
    firstNameLabel: "",
    lastNameLabel: "",
    genderLabel: { label: "", options: [] },
    phoneLabel: "",
    dateOfBirthLabel: "",
    districtLabel: "",
    villageLabel: "",
    blockLabel: "",
    gpLabel: "",
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form1_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.patientdetailsform))
      .catch((error) => console.error("Error loading language file:", error));
  }, [language]);

  useEffect(() => {
    fetch(`/locales/states_${language}.json`)
      .then((response) => response.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching states:", err));
  }, [language]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    register,
  } = useForm<PatientDetailsData>({
    defaultValues: data,
    resolver: zodResolver(patientDetailsSchema),
  });

  const onSubmit = (stepData: PatientDetailsData) => {
    onSave(stepData); // Save the data to the parent component
    onNext(); // Move to next step
  };

  const formFields: {
    name: keyof PatientDetailsData;
    type: "text" | "select" | "date" | "radio";
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
    { name: "phone", type: "text", label: labels.phoneLabel },
    { name: "dateOfBirth", type: "date", label: labels.dateOfBirthLabel },
    {
      name: "stateName",
      type: "select",
      label: state.states.label,
      options: state.states.options,
    },
    { name: "district", type: "text", label: labels.districtLabel },
    { name: "village", type: "text", label: labels.villageLabel },
    { name: "block", type: "text", label: labels.blockLabel },
    { name: "gp", type: "text", label: labels.gpLabel },
  ];

  if (!labels) return <p>Loading...</p>;

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
              InputLabelProps={
                field.type === "date" ? { shrink: true } : undefined
              }
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message}
            />
          ) : field.type === "select" ? (
            <TextField
              key={field.name}
              {...register(field.name)}
              select
              label={field.label}
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : field.type === "radio" ? (
            <FormControl
              key={field.name}
              margin="normal"
              error={!!errors[field.name]}
            >
              <FormLabel>{field.label}</FormLabel>
              <Controller
                name={field.name}
                control={control}
                rules={{ required: `${field.label} is required` }}
                render={({ field: radioField }) => (
                  <RadioGroup {...radioField} row>
                    {field.options?.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          ) : null
        )}

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Save and Next
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PatientDetailsForm;
