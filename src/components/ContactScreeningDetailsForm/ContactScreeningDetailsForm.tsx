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
  CircularProgress,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LabelOption } from "../datatypes/DataTypes";

export type ContactScreeningData = {
  contactScreeningDone: boolean;
  dateOfContactScreening: string;
  noOfHHCsAvailable: number;
  noOfHHCsScreened: number;
  noOfHHCsWithTBSymptoms: number;
  noOfHHCsReferredTBTesting: number;
  noOfHHCsDiagnosedTB: number;
  noOfHHCsTBInitiatedATT: number;
  noOfHHCsUndergoneLTBITest: number;
  noOfEligibleForTPT: number;
  noOfHHCsInitiatedTPT: number;
};

export interface ContactScreeningDetailsFormLabelsData {
  patientNameLabel: string;
  contactScreeningDoneLabel: LabelOption;
  dateOfContactScreeningLabel: string;
  noOfHHCsAvailableLabel: string;
  noOfHHCsScreenedLabel: string;
  noOfHHCsWithTBSymptomsLabel: string;
  noOfHHCsReferredTBTestingLabel: string;
  noOfHHCsDiagnosedTBLabel: string;
  noOfHHCsTBInitiatedATTLabel: string;
  noOfHHCsUndergoneLTBITestLabel: string;
  noOfEligibleForTPTLabel: string;
  noOfHHCsInitiatedTPTLabel: string;
}

const contactScreeningDetailsSchema = z.object({
  contactScreeningDone: z.boolean(),
  dateOfContactScreening: z.string().optional(),
  noOfHHCsAvailable: z.number().optional(),
  noOfHHCsScreened: z.number().optional(),
  noOfHHCsWithTBSymptoms: z.number().optional(),
  noOfHHCsReferredTBTesting: z.number().optional(),
  noOfHHCsDiagnosedTB: z.number().optional(),
  noOfHHCsTBInitiatedATT: z.number().optional(),
  noOfHHCsUndergoneLTBITest: z.number().optional(),
  noOfEligibleForTPT: z.number().optional(),
  noOfHHCsInitiatedTPT: z.number().optional(),
});

const ContactScreeningDetailsForm = ({
  language,
  data,
  onSave,
  onClose,
  onSubmit,
  onBack,
  functionality,
  patientName,
  loading,
}: any) => {

  const [labels, setLabels] = useState<ContactScreeningDetailsFormLabelsData>({
    patientNameLabel: "",
    contactScreeningDoneLabel: { label: "", options: [] },
    dateOfContactScreeningLabel: "",
    noOfHHCsAvailableLabel: "",
    noOfHHCsScreenedLabel: "",
    noOfHHCsWithTBSymptomsLabel: "",
    noOfHHCsReferredTBTestingLabel: "",
    noOfHHCsDiagnosedTBLabel: "",
    noOfHHCsTBInitiatedATTLabel: "",
    noOfHHCsUndergoneLTBITestLabel: "",
    noOfEligibleForTPTLabel: "",
    noOfHHCsInitiatedTPTLabel: "",
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form4_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.nikshaydetailsform))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    register,
  } = useForm<ContactScreeningData>({
    defaultValues: data || {},
    resolver: zodResolver(contactScreeningDetailsSchema),
    mode: "onChange",
    shouldUnregister: true,
  });

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key as keyof ContactScreeningData, data[key]);
      });
    }
  }, [data, setValue]);

  const contactScreeningDone = useWatch({
    control,
    name: "contactScreeningDone",
  });

  const onFormSubmit = (stepData: ContactScreeningData) => {
    onSave(stepData);
  };

  const fieldMappings: Record<string, keyof ContactScreeningData> = {
    noOfHHCsAvailableLabel: "noOfHHCsAvailable",
    noOfHHCsScreenedLabel: "noOfHHCsScreened",
    noOfHHCsWithTBSymptomsLabel: "noOfHHCsWithTBSymptoms",
    noOfHHCsReferredTBTestingLabel: "noOfHHCsReferredTBTesting",
    noOfHHCsDiagnosedTBLabel: "noOfHHCsDiagnosedTB",
    noOfHHCsTBInitiatedATTLabel: "noOfHHCsTBInitiatedATT",
    noOfHHCsUndergoneLTBITestLabel: "noOfHHCsUndergoneLTBITest",
    noOfEligibleForTPTLabel: "noOfEligibleForTPT",
    noOfHHCsInitiatedTPTLabel: "noOfHHCsInitiatedTPT",
  };

  if (!labels) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6">Contact Screening Details</Typography>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        {functionality === "register" && (
          <TextField
            label={labels.patientNameLabel}
            value={patientName}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black", // Ensures text remains black
              },
            }}
          />
        )}
        <FormControl fullWidth margin="normal">
          <InputLabel>{labels.contactScreeningDoneLabel.label}</InputLabel>
          <Controller
            name="contactScreeningDone"
            control={control}
            disabled={loading}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "true";
                  field.onChange(value);
                  if (!value) {
                    Object.keys(labels).forEach((key) =>
                      setValue(key as keyof ContactScreeningData, "")
                    );
                  }
                }}
              >
                {labels.contactScreeningDoneLabel.options?.map((option) => (
                  <MenuItem
                    key={option.value.toString()}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {contactScreeningDone && (
          <>
            <TextField
              key="dateOfContactScreening"
              {...register("dateOfContactScreening")}
              label={labels.dateOfContactScreeningLabel}
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              disabled={loading}
              error={!!errors.dateOfContactScreening}
              helperText={errors.dateOfContactScreening?.message}
            />
            {Object.entries(fieldMappings).map(([labelKey, fieldName]) => (
              <TextField
                key={fieldName}
                label={(labels as any)[labelKey]}
                type="number"
                {...register(fieldName, { valueAsNumber: true })}
                fullWidth
                margin="normal"
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={loading}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message}
              />
            ))}
          </>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          {functionality === "register" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onBack}
              disabled
            >
              Back
            </Button>
          )}
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

export default ContactScreeningDetailsForm;
