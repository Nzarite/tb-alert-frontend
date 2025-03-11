import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { LabelOption } from "../datatypes/DataTypes";

export type TbDetailsData = {
  typeOfPwtb: string;
  clinicalOrMicrobiological: string;
  dateOfDiagnosis: string;
  dateOfTreatmentInitiation: string;
  typeOfTb: string;
  dstbOrDrtb: string;
};

export interface TbDetailsFormLabelsData {
  tbDetailsLabel: string,
  patientNameLabel: string;
  typeOfPwtbLabel: LabelOption;
  clinicalOrMicrobiologicalLabel: LabelOption;
  dateOfDiagnosisLabel: string;
  dateOfTreatmentInitiationLabel: string;
  typeOfTbLabel: LabelOption;
  dstbOrDrtbLabel: LabelOption;
}

const tbDetailsSchema = z.object({
  typeOfPwtb: z.enum(["Identified by Project", "Received from NTEP"], {
    errorMap: () => ({ message: "Type of PwTB is required" }),
  }),
  clinicalOrMicrobiological: z.enum(["Clinical", "Microbiological"], {
    errorMap: () => ({ message: "Please select Clinical or Microbiological" }),
  }),
  dateOfDiagnosis: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  dateOfTreatmentInitiation: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  typeOfTb: z.enum(["PTB", "EPTB"], {
    errorMap: () => ({ message: "Type of TB is required" }),
  }),
  dstbOrDrtb: z.enum(["DS-TB", "DR-TB"], {
    errorMap: () => ({ message: "Please select DS-TB or DR-TB" }),
  }),
});

const TbDetailsForm = ({
  language,
  data,
  onSave,
  onClose,
  onBack,
  functionality,
  patientName,
  loading,
}: any) => {

  const [labels, setLabels] = useState<TbDetailsFormLabelsData>({
    tbDetailsLabel: "",
    patientNameLabel: "",
    typeOfPwtbLabel: { label: "", options: [] },
    clinicalOrMicrobiologicalLabel: { label: "", options: [] },
    dateOfDiagnosisLabel: "",
    dateOfTreatmentInitiationLabel: "",
    typeOfTbLabel: { label: "", options: [] },
    dstbOrDrtbLabel: { label: "", options: [] },
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form2_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.tbdetailsform))
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
    register,
  } = useForm<TbDetailsData>({
    defaultValues: data || {},
    resolver: zodResolver(tbDetailsSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key as keyof TbDetailsData, data[key]);
      });
    }
  }, [data, setValue]);

  const onSubmit = (stepData: TbDetailsData) => {
    onSave(stepData);
  };

  const formFields: {
    name: keyof TbDetailsData;
    type: "text" | "select" | "date";
    label: string;
    options?: { label: string; value: string }[];
  }[] = [
    {
      name: "typeOfPwtb",
      type: "select",
      label: labels.typeOfPwtbLabel.label,
      options: labels.typeOfPwtbLabel.options,
    },
    {
      name: "clinicalOrMicrobiological",
      type: "select",
      label: labels.clinicalOrMicrobiologicalLabel.label,
      options: labels.clinicalOrMicrobiologicalLabel.options,
    },

    {
      name: "dateOfDiagnosis",
      type: "date",
      label: labels.dateOfDiagnosisLabel,
    },
    {
      name: "dateOfTreatmentInitiation",
      type: "date",
      label: labels.dateOfTreatmentInitiationLabel,
    },
    {
      name: "typeOfTb",
      type: "select",
      label: labels.typeOfTbLabel.label,
      options: labels.typeOfTbLabel.options,
    },
    {
      name: "dstbOrDrtb",
      type: "select",
      label: labels.dstbOrDrtbLabel.label,
      options: labels.dstbOrDrtbLabel.options,
    },
  ];

  if (!labels) return <CircularProgress />;

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6">{labels.tbDetailsLabel}</Typography>
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
        {formFields.map((field) =>
          field.type === "text" ? (
            <TextField
              key={field.name}
              {...register(field.name)}
              label={field.label}
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
              key={field.name}
              name={field.name}
              control={control}
              defaultValue={data ? data[field.name] : ""}
              render={({ field: { onChange, value } }) => (
                <TextField
                  select
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={loading}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message}
                  value={value || ""} // Ensure controlled value
                  onChange={onChange}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          ) : (
            // <TextField
            //   key={field.name}
            //   {...register(field.name)}
            //   select
            //   label={field.label}
            //   variant="outlined"
            //   fullWidth
            //   margin="normal"
            //   defaultValue={data?.name || ""}
            //   slotProps={{ inputLabel: { shrink: true } }}
            //   error={!!errors[field.name]}
            //   helperText={errors[field.name]?.message}
            // >
            //   {field.options?.map((option) => (
            //     <MenuItem key={option.value} value={option.value}>
            //       {option.label}
            //     </MenuItem>
            //   ))}
            // </TextField>
            <TextField
              key={field.name}
              {...register(field.name)}
              label={field.label}
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              slotProps={{ inputLabel: { shrink: true } }}
              disabled={loading}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message}
            />
          )
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

export default TbDetailsForm;
