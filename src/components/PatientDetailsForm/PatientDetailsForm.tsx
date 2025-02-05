import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientRegistrationData } from "../../pages/PatientRegistrationPage";

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

// export type PatientRegistrationData = {
//   firstName: string;
//   lastName: string;
//   districtName: string;
//   blockName: string;
//   gpName: string;
//   villageName: string;
//   typeOfPwtb: string;
//   clinicalMicrobiological: string;
//   nameOfPwtb: string; 
//   age: number;
//   contactNumber: string;
//   dateOfDiagnosis: string;
//   dateOfTreatmentInitiation: string;
//   typeOfTb: string;
//   dsTbDrTb: string;
// };

const PatientDetailsForm = ( {language}:any ) => {

  const [labels, setLabels] = useState<{ [key: string]: string } | null>(null);

  useEffect(() => {
    fetch(`/locales/patient_registration_form1_en.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.patientdetailsform))
      .catch((error) => console.error("Error loading language file:", error));
  }, [language]);

  const {control, handleSubmit, formState: { errors }, setValue,  reset, register} = useForm<PatientRegistrationData>({
    resolver: zodResolver(
      patientDetailsSchema
    ),
  });
  
  const patientDetailsFields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "districtName", label: "Name of the District", type: "text" },
    { name: "blockName", label: "Name of the Block", type: "text" },
    { name: "gpName", label: "Name of the GP", type: "text" },
    { name: "villageName", label: "Name of the Village", type: "text" },
    { name: "typeOfPwtb", label: "Type of PwTB", type: "select", options: ["Identified by Project", "Received from NTEP"] },
    { name: "clinicalMicrobiological", label: "Clinical/Microbiological", type: "select", options: ["Clinical", "Microbiological"] },
    { name: "nameOfPwtb", label: "Name of PwTB", type: "text" },
    { name: "age", label: "Age", type: "number" },
    { name: "contactNumber", label: "Contact Number", type: "text" },
    { name: "dateOfDiagnosis", label: "Date of Diagnosis", type: "date" },
    { name: "dateOfTreatmentInitiation", label: "Date of Treatment Initiation", type: "date" },
    { name: "typeOfTb", label: "Type of TB(PTB/EPTB)", type: "select", options: ["PTB", "EPTB"] },
    { name: "dsTbDrTb", label: "DS-TB/DR-TB", type: "select", options: ["DS-TB", "DR-TB"] },
  ];

  if (!labels) return <p>Loading...</p>;

  return (
    <Box>
      <Typography variant="h6">Patient Details</Typography>
      {patientDetailsFields.map(({ name, type, options }) => (
        <Controller
          key={name}
          name={name as keyof PatientRegistrationData}
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
                error={!!errors[name as keyof PatientRegistrationData]}
                helperText={errors[name as keyof PatientRegistrationData]?.message}
                slotProps={{ select: { native: true } }}
              >
                {/* <option value=""></option> */}
                {options?.map((option) => (
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
                  error={!!errors[name as keyof PatientRegistrationData]}
                  helperText={errors[name as keyof PatientRegistrationData]?.message}
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
                error={!!errors[name as keyof PatientRegistrationData]}
                helperText={errors[name as keyof PatientRegistrationData]?.message}
              />
            )}
        />
      ))}
    </Box>
  )
};

export default PatientDetailsForm;
