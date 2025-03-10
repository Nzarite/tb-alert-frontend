import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { LabelOption } from "../datatypes/DataTypes";

export type DiagnosedWithTBData = {
  isDiagnosedWithTB: boolean;
};

export interface DiagnosedWithTBLabelsData {
  diagnosedWithTBLabel: LabelOption;
  patientNameLabel: string;
}

const diagnosedWithTBSchema = z.object({
  isDiagnosedWithTB: z.boolean({
    errorMap: () => ({ message: "Consent for message is required" }),
  }),
});

const DiagnosedWithTB = ({
  language,
  data,
  onSave,
  onClose,
  functionality,
  patientName,
  loading,
  patientId,
}: any) => {
  const [labels, setLabels] = useState<DiagnosedWithTBLabelsData>({
    diagnosedWithTBLabel: { label: "", options: [] },
    patientNameLabel: "",
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form_diagnoseTb_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.diagnoseWithTBForm))
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
  } = useForm<DiagnosedWithTBData>({
    defaultValues: data || {},
    resolver: zodResolver(diagnosedWithTBSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key as keyof DiagnosedWithTBData, data[key]);
      });
    }
  }, [data, setValue]);

  const onSubmit = (stepData: DiagnosedWithTBData) => {
    onSave(stepData);
    // if (functionality !== "editdetails") {
    //   onNext();
    // }
  };

  const formFields: {
    name: keyof DiagnosedWithTBData;
    type: "text" | "select" | "date" | "radio" | "number";
    label: string;
    options?: { label: string; value: string }[];
  }[] = [
    {
      name: "isDiagnosedWithTB",
      type: "radio",
      label: labels.diagnosedWithTBLabel.label,
      options: labels.diagnosedWithTBLabel.options,
    },
  ];

  if (!labels) return <CircularProgress />;

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6">Diagnosed With TB</Typography>
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
        {formFields.map((field) => (
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
                      field.name === "isDiagnosedWithTB"
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
        ))}

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

export default DiagnosedWithTB;
