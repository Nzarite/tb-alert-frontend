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
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type TbDetailsData = {
  nameOfPwtb: string;
  typeOfPwtb: string;
  clinicalOrMicrobiological: string;
  dateOfDiagnosis: string;
  dateOfTreatmentInitiation: string;
  typeOfTb: string;
  dstbOrDrtb: string;
};

const tbDetailsSchema = z.object({
  nameOfPwtb: z.string().min(1, "Name of PwTB is required"),
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
  // onNext,
  onBack,
  functionality,
}: any) => {
  interface LabelOption {
    label: string;
    options: { label: string; value: any }[];
  }

  interface TbDetailsFormLabelsData {
    nameOfPwtbLabel: string;
    typeOfPwtbLabel: LabelOption;
    clinicalOrMicrobiologicalLabel: LabelOption;
    dateOfDiagnosisLabel: string;
    dateOfTreatmentInitiationLabel: string;
    typeOfTbLabel: LabelOption;
    dstbOrDrtbLabel: LabelOption;
  }

  const [labels, setLabels] = useState<TbDetailsFormLabelsData>({
    nameOfPwtbLabel: "",
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
      .catch((error) => console.error("Error loading language file:", error));
  }, [language]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    register,
  } = useForm<TbDetailsData>({
    defaultValues: data || {},
    resolver: zodResolver(tbDetailsSchema),
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
    // if (functionality !== "editdetails") {
    //   onNext();
    // }
  };

  const formFields: {
    name: keyof TbDetailsData;
    type: "text" | "select" | "date";
    label: string;
    options?: { label: string; value: string }[];
  }[] = [
    { name: "nameOfPwtb", type: "text", label: labels.nameOfPwtbLabel },
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

  if (!labels) return <p>Loading...</p>;

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6">TB Details</Typography>
        {/* Loop through simple text fields */}
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
          {functionality === "register" && (
            <Button type="submit" variant="contained" color="primary">
              Save and Next
            </Button>
          )}
          {functionality === "editdetails" && (
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default TbDetailsForm;
