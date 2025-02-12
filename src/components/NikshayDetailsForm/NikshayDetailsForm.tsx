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
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type NikshayDetailsData = {
  nikshayId: string;
  udstStatus: boolean;
  dateOfUdst?: string;
  resultOfUdst?: string;
  dbtStatus: boolean;
  dateOfDbt?: string;
  nikshayMitraStatus: boolean;
  nikshayMitraDate?: string;
  nikshayMitraName?: string;
};

const nikshayDetailsSchema = z
  .object({
    nikshayId: z.string().min(1, "Nikshay ID is required"),
    udstStatus: z.boolean(),
    dateOfUdst: z.string().optional(),
    resultOfUdst: z.string().optional(),
    dbtStatus: z.boolean(),
    dateOfDbt: z.string().optional(),
    nikshayMitraStatus: z.boolean(),
    nikshayMitraDate: z.string().optional(),
    nikshayMitraName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate date fields with proper date format check
    const isValidDate = (dateStr: string) => !isNaN(Date.parse(dateStr));

    if (data.udstStatus) {
      if (!data.dateOfUdst || !isValidDate(data.dateOfUdst)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid date is required",
          path: ["dateOfUdst"],
        });
      }
      if (!data.resultOfUdst) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selection is required",
          path: ["resultOfUdst"],
        });
      }
    }

    if (data.dbtStatus) {
      if (!data.dateOfDbt || !isValidDate(data.dateOfDbt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid date is required",
          path: ["dateOfDbt"],
        });
      }
    }

    if (data.nikshayMitraStatus) {
      if (!data.nikshayMitraDate || !isValidDate(data.nikshayMitraDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid date is required",
          path: ["nikshayMitraDate"],
        });
      }
      if (!data.nikshayMitraName || data.nikshayMitraName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nikshay Mitra Name is required",
          path: ["nikshayMitraName"],
        });
      }
    }
  });

const NikshayDetailsForm = ({
  language,
  data,
  onSave,
  onNext,
  onBack,
}: any) => {
  interface LabelOption {
    label: string;
    options: { label: string; value: any }[];
  }

  interface NikshayDetailsFormLabelsData {
    nikshayIdLabel: string;
    udstStatusLabel: LabelOption;
    dateOfUdstLabel: string;
    resultOfUdstLabel: LabelOption;
    dbtStatusLabel: LabelOption;
    dateOfDbtLabel: string;
    nikshayMitraStatusLabel: LabelOption;
    nikshayMitraDateLabel: string;
    nikshayMitraNameLabel: string;
  }

  const [labels, setLabels] = useState<NikshayDetailsFormLabelsData>({
    nikshayIdLabel: "",
    udstStatusLabel: { label: "", options: [] },
    dateOfUdstLabel: "",
    resultOfUdstLabel: { label: "", options: [] },
    dbtStatusLabel: { label: "", options: [] },
    dateOfDbtLabel: "",
    nikshayMitraStatusLabel: { label: "", options: [] },
    nikshayMitraDateLabel: "",
    nikshayMitraNameLabel: "",
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form3_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.nikshaydetailsform || {}))
      .catch((error) => console.error("Error loading language file:", error));
  }, [language]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    register,
  } = useForm<NikshayDetailsData>({
    defaultValues: data,
    resolver: zodResolver(nikshayDetailsSchema),
  });

  const onSubmit = (stepData: NikshayDetailsData) => {
    onSave(stepData);
    onNext();
  };

  const udstStatus = useWatch({ control, name: "udstStatus" });
  const dbtStatus = useWatch({ control, name: "dbtStatus" });
  const nikshayMitraStatus = useWatch({ control, name: "nikshayMitraStatus" });

  if (!labels) return <p>Loading...</p>;

  return (
    <Box>
      <Typography variant="h6">Nikshay Details</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={labels.nikshayIdLabel || "Nikshay Id"}
          {...register("nikshayId")}
          error={!!errors.nikshayId}
          helperText={errors.nikshayId?.message}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal" error={!!errors.udstStatus}>
          <InputLabel>{labels.udstStatusLabel.label}</InputLabel>
          <Controller
            name="udstStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(e) => {
                  const value = e.target.value === "true";
                  field.onChange(value);
                  if (!value) {
                    setValue("dateOfUdst", "");
                    setValue("resultOfUdst", "");
                  }
                }}
              >
                {labels.udstStatusLabel.options.map((option) => (
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
          <Typography variant="caption" color="error">
            {errors.udstStatus?.message}
          </Typography>
        </FormControl>

        {udstStatus && (
          <TextField
            label={labels.dateOfUdstLabel || "UDST Test Date"}
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("dateOfUdst")}
            error={!!errors.dateOfUdst}
            helperText={errors.dateOfUdst?.message}
            fullWidth
            margin="normal"
          />
        )}

        {udstStatus && (
          <FormControl fullWidth margin="normal" error={!!errors.resultOfUdst}>
            <InputLabel>{labels.resultOfUdstLabel.label}</InputLabel>
            <Controller
              name="resultOfUdst"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {labels.resultOfUdstLabel.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <Typography variant="caption" color="error">
              {errors.resultOfUdst?.message}
            </Typography>
          </FormControl>
        )}

        <FormControl fullWidth margin="normal" error={!!errors.dbtStatus}>
          <InputLabel>{labels.dbtStatusLabel.label}</InputLabel>
          <Controller
            name="dbtStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(e) => {
                  const value = e.target.value === "true";
                  field.onChange(value);
                  if (!value) {
                    setValue("dateOfDbt", "");
                  }
                }}
              >
                {labels.dbtStatusLabel.options.map((option) => (
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
          <Typography variant="caption" color="error">
            {errors.dbtStatus?.message}
          </Typography>
        </FormControl>

        {dbtStatus && (
          <TextField
            label={labels.dateOfDbtLabel || "DBT Enrollment Date"}
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("dateOfDbt")}
            error={!!errors.dateOfDbt}
            helperText={errors.dateOfDbt?.message}
            fullWidth
            margin="normal"
          />
        )}

        <FormControl
          fullWidth
          margin="normal"
          error={!!errors.nikshayMitraStatus}
        >
          <InputLabel>{labels.nikshayMitraStatusLabel.label}</InputLabel>
          <Controller
            name="nikshayMitraStatus"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(e) => {
                  const value = e.target.value === "true";
                  field.onChange(value);
                  if (!value) {
                    setValue("nikshayMitraDate", "");
                    setValue("nikshayMitraName", "");
                  }
                }}
              >
                {labels.nikshayMitraStatusLabel.options.map((option) => (
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
          <Typography variant="caption" color="error">
            {errors.nikshayMitraStatus?.message}
          </Typography>
        </FormControl>

        {nikshayMitraStatus && (
          <TextField
            label={labels.nikshayMitraDateLabel || "Nikshay Mitra Link Date"}
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("nikshayMitraDate")}
            error={!!errors.nikshayMitraDate}
            helperText={errors.nikshayMitraDate?.message}
            fullWidth
            margin="normal"
          />
        )}

        {nikshayMitraStatus && (
          <TextField
            label={labels.nikshayMitraNameLabel || "Nikshay Mitra Name"}
            {...register("nikshayMitraName")}
            error={!!errors.nikshayMitraName}
            helperText={errors.nikshayMitraName?.message}
            fullWidth
            margin="normal"
          />
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={onBack} disabled>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save and Next
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NikshayDetailsForm;
