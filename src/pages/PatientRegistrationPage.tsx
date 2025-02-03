import { useState } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
});

export type PatientRegistrationData = {
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
  pwtbDoneForUdst: Boolean;
  contactScreening: Boolean;
};

const steps = ["Patient Details", "Nikshay Details", "Contact Screening Details"];

const PatientRegistrationPage = () => {

  const [activeStep, setActiveStep] = useState(0);

  const {control, handleSubmit, formState: { errors }, reset,} = useForm<PatientRegistrationData>({
    resolver: zodResolver(
      personalInfoSchema
    ),
  });

  const onSubmit = (data: PatientRegistrationData) => {
    console.log("Step Data:", data);
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      console.log("Final Patient Data Submitted:", data);
    }
  };

  const handleSave = () => {
    console.log(`Data saved for step ${activeStep}`);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

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
    { name: "dateOfDiagnosis", label: "Date of Diagnosis", type: "text" },
    { name: "dateOfTreatmentInitiation", label: "Date of Treatment Initiation", type: "text" },
    { name: "typeOfTb", label: "Type of TB(PTB/EPTB)", type: "select", options: ["PTB", "EPTB"] },
    { name: "dsTbDrTb", label: "DS-TB/DR-TB", type: "select", options: ["DS-TB", "DR-TB"] },
  ];

  return (
    <>
      <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Patient Registration
            </Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        <Grid item xs={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6">Patient Details</Typography>
                  {patientDetailsFields.map(({ name, label, type, options }) => (
                    <Controller
                      key={name}
                      name={name as keyof PatientRegistrationData}
                      control={control}
                      render={({ field }) => 
                        type === "select" ? (
                          <TextField
                            {...field}
                            select
                            label={label}
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
                        ) : (
                          <TextField
                            {...field}
                            label={label}
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
              )}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6">Nikshay Details</Typography>
                  <Controller
                    name="pwtbDoneForUdst"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="PWTB Done for UDST"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                </Box>
              )}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6">Contact Screening Details</Typography>
                  <Controller
                    name="dsTbDrTb"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="DS-TB/DR-TB"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                </Box>
              )}

              <Box mt={3} display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" color="secondary">
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <>
                    <Button variant="contained" color="info" onClick={handleSave}>
                      Save
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Next
                    </Button>
                  </>
                ) : (
                  <Button type="submit" variant="contained" color="success">
                    Submit
                  </Button>
                )}
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  )
}

export default PatientRegistrationPage