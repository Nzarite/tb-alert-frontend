import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper, MenuItem } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type PatientDetailsData = {
  firstName: string;
  lastName: string;
  districtName: string;
  blockName: string;
  gpName: string;
  villageName: string;
  typeOfPwtb: string;
  clinicalMicrobiological: string;
  nameOfPwtb: string; 
  age: number;
  contactNumber: string;
  dateOfDiagnosis: string;
  dateOfTreatmentInitiation: string;
  typeOfTb: string;
  dsTbDrTb: string;
};

const patientDetailsSchema = z.object({
  // firstName: z.string().min(1, "First Name is required"),
  // lastName: z.string().min(1, "Last Name is required"),
  // districtName: z.string().min(1, "District Name is required"),
  // blockName: z.string().min(1, "Block Name is required"),
  // gpName: z.string().min(1, "GP Name is required"),
  // villageName: z.string().min(1, "Village Name is required"),
  // // typeOfPwtb: z.string().min(1, "Last Name is required"),
  // // clinicalMicrobiological: z.string().min(1, "Last Name is required"),
  // nameOfPwtb: z.string().min(1, "Name of PwTB is required"), 
  // // age: z.number().min(1, "Age must be at least 1").max(120, "Age cannot exceed 120").int("Age must be a whole number"),
  // contactNumber: z.string()
  //   .regex(/^\d+$/, "Contact number must contain only numbers")
  //   .min(10, "Contact number must be at least 10 digits")
  //   .max(15, "Contact number can't exceed 15 digits"),
  // // dateOfDiagnosis: z.string().min(1, "Last Name is required"),
  // // dateOfTreatmentInitiation: z.string().min(1, "Last Name is required"),
  // // typeOfTb: z.string().min(1, "Last Name is required"),
  // // dsTbDrTb: z.string().min(1, "Last Name is required"),
});

const PatientDetailsForm = ( {language, data, onSave, onNext}:any ) => {

  interface LabelOption {
    label: string;
    options: { label: string; value: any }[];
  }
  
  interface PatientDetailsFormLabelsData {
    firstNameLabel: string;
    lastNameLabel: string;
    districtNameLabel: string;
    blockNameLabel: string;
    gpNameLabel: string;
    villageNameLabel: string;
    typeOfPwtbLabel: LabelOption;
    clinicalMicrobiologicalLabel: LabelOption;
    nameOfPwtbLabel: string; 
    ageLabel: string;
    contactNumberLabel: string;
    dateOfDiagnosisLabel: string;
    dateOfTreatmentInitiationLabel: string;
    typeOfTbLabel: LabelOption;
    dsTbDrTbLabel: LabelOption;
  }

  const [labels, setLabels] = useState<PatientDetailsFormLabelsData>({
    firstNameLabel: "",
    lastNameLabel: "",
    districtNameLabel: "",
    blockNameLabel: "",
    gpNameLabel: "",
    villageNameLabel: "",
    typeOfPwtbLabel: { label: "", options: [] },
    clinicalMicrobiologicalLabel: { label: "", options: [] },
    nameOfPwtbLabel: "",
    ageLabel: "",
    contactNumberLabel: "",
    dateOfDiagnosisLabel: "",
    dateOfTreatmentInitiationLabel: "",
    typeOfTbLabel: { label: "", options: [] },
    dsTbDrTbLabel: { label: "", options: [] },
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form1_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.patientdetailsform))
      .catch((error) => console.error("Error loading language file:", error));
  }, [language]);

  const {control, handleSubmit, formState: { errors }, setValue,  reset, register} = useForm<PatientDetailsData>({
    defaultValues: data,
    resolver: zodResolver(
      patientDetailsSchema
    ),
  });

  const onSubmit = (stepData: PatientDetailsData) => {
    console.log("Patient Details:", stepData);
    onSave(stepData); // Save the data to the parent component
    onNext(); // Move to next step
  };

  // const patientDetailsFields = [
  //   { name: "firstName", label: "First Name", type: "text" },
  //   { name: "lastName", label: "Last Name", type: "text" },
  //   { name: "districtName", label: "Name of the District", type: "text" },
  //   { name: "blockName", label: "Name of the Block", type: "text" },
  //   { name: "gpName", label: "Name of the GP", type: "text" },
  //   { name: "villageName", label: "Name of the Village", type: "text" },
  //   { name: "typeOfPwtb", label: "Type of PwTB", type: "select", options: ["Identified by Project", "Received from NTEP"] },
  //   { name: "clinicalMicrobiological", label: "Clinical/Microbiological", type: "select", options: ["Clinical", "Microbiological"] },
  //   { name: "nameOfPwtb", label: "Name of PwTB", type: "text" },
  //   { name: "age", label: "Age", type: "number" },
  //   { name: "contactNumber", label: "Contact Number", type: "text" },
  //   { name: "dateOfDiagnosis", label: "Date of Diagnosis", type: "date" },
  //   { name: "dateOfTreatmentInitiation", label: "Date of Treatment Initiation", type: "date" },
  //   { name: "typeOfTb", label: "Type of TB(PTB/EPTB)", type: "select", options: ["PTB", "EPTB"] },
  //   { name: "dsTbDrTb", label: "DS-TB/DR-TB", type: "select", options: ["DS-TB", "DR-TB"] },
  // ];

    const formFields: {
      name: keyof PatientDetailsData;
      type: "text" | "select" | "date";
      label: string;
      options?: { label: string; value: string }[];
      }[] = [
        { name: "firstName", type: "text", label: labels.firstNameLabel },
        { name: "lastName", type: "text", label: labels.lastNameLabel },
        { name: "districtName", type: "text", label: labels.districtNameLabel },
        { name: "blockName", type: "text", label: labels.blockNameLabel },
        { name: "gpName", type: "text", label: labels.gpNameLabel },
        { name: "villageName", type: "text", label: labels.villageNameLabel },
        { name: "typeOfPwtb", type: "select", label: labels.typeOfPwtbLabel.label, options:labels.typeOfPwtbLabel.options },
        { name: "clinicalMicrobiological", type: "select", label: labels.clinicalMicrobiologicalLabel.label, options: labels.clinicalMicrobiologicalLabel.options },
        { name: "nameOfPwtb", type: "text", label: labels.nameOfPwtbLabel },
        { name: "age", type: "text", label: labels.ageLabel },
        { name: "contactNumber", type: "text", label: labels.contactNumberLabel },
        { name: "typeOfTb", type: "select", label: labels.typeOfTbLabel.label, options: labels.typeOfTbLabel.options },
        { name: "dateOfDiagnosis", type: "date", label: labels.dateOfDiagnosisLabel },
        { name: "dateOfTreatmentInitiation", type: "date", label: labels.dateOfTreatmentInitiationLabel },
        { name: "dsTbDrTb", type: "select", label: labels.dsTbDrTbLabel.label, options: labels.dsTbDrTbLabel.options },
    ];
    

  if (!labels) return <p>Loading...</p>;

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6">Patient Details</Typography>
      {/* Loop through simple text fields */}
      {formFields.map((field) => (
        field.type === "text" ? (
          <TextField
            key={field.name}
            {...register(field.name)}
            label={field.label}
            variant="outlined"
            fullWidth
            margin="normal"
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
        ) : (
          // **Date Picker Field**
          <TextField
            key={field.name}
            {...register(field.name)}
            label={field.label}
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }} // Keeps label above date picker
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
          />
        )
      ))}


      {/* {patientDetailsFields.map(({ name, type, options }) => (
        <Controller
          key={name}
          name={name as keyof PatientDetailsData}
          control={control}
          render={({ field }) => 
            type === "select" ? (
              <TextField
                {...field}
                select
                label={labels[name]}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors[name as keyof PatientDetailsData]}
                helperText={errors[name as keyof PatientDetailsData]?.message}
                onChange={(e) => field.onChange(e.target.value)}
                slotProps={{ select: { native: true } }}
              > */}
                {/* <option value=""></option> */}
                {/* {options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            ) : type === "date" ? (
                <TextField
                  {...field}
                  label={labels[name]}
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors[name as keyof PatientDetailsData]}
                  helperText={errors[name as keyof PatientDetailsData]?.message}
                  onChange={(e) => field.onChange(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
            ) : (
              <TextField
                {...field}
                label={labels[name]}
                variant="outlined"
                fullWidth
                margin="normal"
                type={type} 
                error={!!errors[name as keyof PatientDetailsData]}
                helperText={errors[name as keyof PatientDetailsData]?.message}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
        />
      ))} */}
      <Box mt={3}>
        <Button type="submit" variant="contained" color="primary">
          Save and Next
        </Button>
      </Box>
      </form>
    </Box>
  )
};

export default PatientDetailsForm;
