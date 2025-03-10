import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { Role } from "../Authorization/Roles/Types";
import { useAuth } from "react-oidc-context";
import { LabelOption, StateOption, TeleCaller } from "../datatypes/DataTypes";
import axiosInstance from "../axiosInstance";

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
  createdBy: string;
  reminderTime?: string;
};

export interface PatientDetailsFormLabelsData {
  patientIdLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  genderLabel: LabelOption;
  phoneNumberLabel: string;
  ageLabel: string;
  stateLabel: string;
  districtLabel: string;
  villageLabel: string;
  blockLabel: string;
  gpLabel: string;
  consentForMessageLabel: LabelOption;
  currentStatusLabel: string;
  reminderTimeLabel: string;
  createdByLabel: string;
}

const PatientDetailsForm = ({
  language,
  data,
  onSave,
  onClose,
  // onNext,
  functionality,
  loading,
}: any) => {
  const [states, setStates] = useState<StateOption[]>([]);
  const [backendStates, setBackendStates] = useState<string[]>([]);
  const [filteredStates, setFilteredStates] = useState<StateOption[]>([]);
  const [allDistricts, setAllDistricts] = useState<
    { value: string; districts: string[] }[]
  >([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const [allTelecaller, setAllTelecaller] = useState<
    { value: string; telecallers: string[] }[]
  >([]);
  const [telecallers, setTelecallers] = useState<TeleCaller[]>();

  const auth = useAuth();

  const userState =
    useSelector((state: any) => state.userState) ||
    localStorage.getItem("userState");

  const userRoles: Role[] = useSelector(
    (state: any) =>
      state.user?.profile?.client_roles || auth?.user?.profile?.client_roles
  ) as Role[];

  const [labels, setLabels] = useState<PatientDetailsFormLabelsData>({
    patientIdLabel: "",
    firstNameLabel: "",
    lastNameLabel: "",
    genderLabel: { label: "", options: [] },
    phoneNumberLabel: "",
    ageLabel: "",
    stateLabel: "",
    districtLabel: "",
    villageLabel: "",
    blockLabel: "",
    gpLabel: "",
    consentForMessageLabel: { label: "", options: [] },
    currentStatusLabel: "",
    reminderTimeLabel: "",
    createdByLabel: "",
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
      .then((data) => setStates(data.stateslist))
      .catch((err) => {
        console.error("Error fetching states:", err);
        alert("Failed to load states data. Please try again.");
      });
  }, [language]);

  useEffect(() => {
    fetch(`/locales/districts_${language}.json`)
      .then((response) => response.json())
      .then((data) => setAllDistricts(data))
      .catch((err) => {
        console.error("Error fetching districts:", err);
        alert("Failed to load districts data. Please try again.");
      });
  }, [language]);

  const fetchStates = async () => {
    try {
      const response = await axiosInstance.get("/state/all");
      const stateNames = response.data.map(
        (state: { stateName: string }) => state.stateName
      );

      setBackendStates(stateNames);
    } catch (error) {
      if (error.status === 401) {
        setBackendStates(userState);
      }
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (backendStates.length > 0) {
      const filtered = states.filter((state) =>
        backendStates.includes(state.value)
      );
      setFilteredStates(filtered);
    }
  }, [backendStates, states]);

  const patientDetailsSchema = z
    .object({
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().optional(),
      gender: z.enum(["Male", "Female"], {
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
      consentForMessage: z.boolean({
        errorMap: () => ({ message: "Consent for message is required" }),
      }),
      createdBy: z.string().superRefine((val, ctx) => {
        if (telecallers && telecallers.length > 0 && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select a Telecaller",
          });
        }
      }),
      reminderTime: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.consentForMessage) {
        if (!data.reminderTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["reminderTime"],
            message:
              "Reminder time is required when consent for message is given",
          });
        } else if (!/^\d{2}:\d{2}$/.test(data.reminderTime)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["reminderTime"],
            message: "Reminder time must be in HH:MM format",
          });
        }
      }
    });

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

  const selectedState = useWatch({ control, name: "state" });

  useEffect(() => {
    if (selectedState && allDistricts.length) {
      const stateData = allDistricts.find(
        (option) => option.value === selectedState
      );
      setDistricts(stateData ? stateData.districts : []);
      setValue("district", "");
    }
  }, [selectedState, setValue, allDistricts]);

  useEffect(() => {
    const fetchTelecaller = async () => {
      try {
        const response = await axiosInstance.get(
          `/telecaller/state/${selectedState}`
        );
        setTelecallers(response.data);
      } catch (error) {}
    };
    fetchTelecaller();
  }, [selectedState]);

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

  const consentForMessage = useWatch({ control, name: "consentForMessage" });

  const formFields: {
    name: keyof PatientDetailsData;
    type: "text" | "select" | "date" | "radio" | "number";
    label: string;
    options?: { label: string; value: string }[];
    disabled: boolean;
  }[] = [
    {
      name: "firstName",
      type: "text",
      label: labels.firstNameLabel,
      disabled: false,
    },
    {
      name: "lastName",
      type: "text",
      label: labels.lastNameLabel,
      disabled: false,
    },
    {
      name: "gender",
      type: "radio",
      label: labels.genderLabel.label,
      options: labels.genderLabel.options,
      disabled: false,
    },
    {
      name: "phoneNumber",
      type: "text",
      label: labels.phoneNumberLabel,
      disabled: false,
    },
    { name: "age", type: "number", label: labels.ageLabel, disabled: false },
    {
      name: "state",
      type: "select",
      label: labels.stateLabel,
      options: userRoles.includes("SuperAdmin")
        ? filteredStates
        : filteredStates.filter((option) => option.value === userState),
      disabled: false,
    },
    {
      name: "district",
      type: "select",
      label: labels.districtLabel,
      options: districts.map((d) => ({ label: d, value: d })),
      disabled: !selectedState,
    },
    {
      name: "village",
      type: "text",
      label: labels.villageLabel,
      disabled: false,
    },
    { name: "block", type: "text", label: labels.blockLabel, disabled: false },
    { name: "gp", type: "text", label: labels.gpLabel, disabled: false },
    {
      name: "createdBy",
      type: "select",
      label: labels.createdByLabel,
      options: telecallers?.map((t) => ({
        label: t.firstName + " " + t.lastName,
        value: t.email,
      })),
      disabled:
        telecallers?.length == 0 ||
        (userRoles.includes("Telecaller") &&
          !userRoles.includes("SuperAdmin") &&
          !userRoles.includes("StateCoordinator")),
    },
    {
      name: "consentForMessage",
      type: "radio",
      label: labels.consentForMessageLabel.label,
      options: labels.consentForMessageLabel.options,
      disabled: false,
    },
  ];

  if (!labels || !states) return <CircularProgress />;
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
              disabled={loading && field.disabled}
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
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      MenuProps: {
                        PaperProps: { style: { maxHeight: 150 } },
                      },
                    },
                  }}
                  // disabled={
                  //   field.name === "district" && !selectedState ? true : false
                  // }
                  onChange={(e) => controllerField.onChange(e.target.value)}
                  error={!!errors[field.name]}
                  disabled={field.disabled}
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
                  <RadioGroup
                    {...radioField}
                    row
                    onChange={(e) =>
                      radioField.onChange(
                        field.name === "consentForMessage"
                          ? e.target.value === "true"
                          : e.target.value
                      )
                    }
                  >
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
              {errors[field.name] && (
                <FormHelperText>{errors[field.name]?.message}</FormHelperText>
              )}
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
                  disabled={loading && field.disabled}
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
        {consentForMessage && (
          <Controller
            key="reminderTime"
            name="reminderTime"
            control={control}
            render={({ field: controllerField }) => (
              <TextField
                {...controllerField}
                label={labels.reminderTimeLabel}
                type="time"
                variant="outlined"
                fullWidth
                margin="normal"
                slotProps={{ inputLabel: { shrink: true } }}
                // defaultValue={}
                disabled={loading}
                error={!!errors.reminderTime}
                helperText={errors.reminderTime?.message}
                onChange={(e) => controllerField.onChange(e.target.value)}
              />
            )}
          />
        )}
        <Box mt={3} display="flex" justifyContent="space-between">
          {functionality === "editdetails" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
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
