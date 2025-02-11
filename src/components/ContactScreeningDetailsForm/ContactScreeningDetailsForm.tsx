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
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  onSubmit,
  onBack,
}: any) => {
  interface LabelOption {
    label: string;
    options?: { label: string; value: boolean }[];
  }

  interface ContactScreeningDetailsFormLabelsData {
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

  const [labels, setLabels] = useState<ContactScreeningDetailsFormLabelsData>({
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
      .catch((error) => console.error("Error loading language file:", error));
  }, [language]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    register,
  } = useForm<ContactScreeningData>({
    defaultValues: data,
    resolver: zodResolver(contactScreeningDetailsSchema),
    shouldUnregister: true,
  });

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

  if (!labels) return <p>Loading...</p>;

  return (
    <Box>
      <Typography variant="h6">Contact Screening Details</Typography>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{labels.contactScreeningDoneLabel.label}</InputLabel>
          <Controller
            name="contactScreeningDone"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
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
              InputLabelProps={{ shrink: true }}
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
                error={!!errors[fieldName]}
                helperText={errors[fieldName]?.message}
              />
            ))}
          </>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="success">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ContactScreeningDetailsForm;
