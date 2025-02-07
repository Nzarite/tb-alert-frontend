import { useState } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, Grid, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import PatientDetailsForm from "../components/PatientDetailsForm/PatientDetailsForm";
import NikshayDetailsForm from "../components/NikshayDetailsForm/NikshayDetailsForm";
import ContactScreeningDetailsForm from "../components/ContactScreeningDetailsForm/ContactScreeningDetailsForm";
import { PatientDetailsData } from "../components/PatientDetailsForm/PatientDetailsForm";
import { NikshayDetailsData } from "../components/NikshayDetailsForm/NikshayDetailsForm";
import { ContactScreeningData } from "../components/ContactScreeningDetailsForm/ContactScreeningDetailsForm";

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
//   nikshayId: string;
//   udstDone: boolean;
//   udstTestDate: string;
//   udstTestResult: string;
//   enrolledForDbt: boolean;
//   dbtEnrollmentDate: string;
//   nikshayMitraLinked: boolean;
//   nikshayMitraLinkDate: string;
//   nikshayMitraName: string;
//   contactScreeningDone: boolean;
//   contactScreeningDate: string;
//   availableHhcs: number;
//   screenedHhcs: number;
//   hhcsWithTbSymptoms: number;
//   hhcsReferredForTbTesting: number;
//   hhcsDiagnosedTb: number;
//   hhcsDiagnosedTbOnAtt: number;
//   hhcsUndergoneLBTI: number;
//   eligibleForTpt: number;
//   hhcsInitiatedOnTpt: number;
// };

const steps = ["Patient Details", "Nikshay Details", "Contact Screening Details"];

const PatientRegistrationPage = () => {

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    patientDetails: {} as PatientDetailsData,
    nikshayDetails: {} as NikshayDetailsData,
    contactScreeningDetails: {} as ContactScreeningData,
  });
  const [language, setLanguage] = useState("en");

  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Final Submitted Data:", data);
  };

  const handleSave = (stepData:any) => {
    if (activeStep === 0) {
      setFormData({ ...formData, patientDetails: stepData });
      console.log("Patient Details Saved:", stepData);
    } else if (activeStep === 1) {
      setFormData({ ...formData, nikshayDetails: stepData });
      console.log("Nikshay Details Saved:", stepData);
    } else if (activeStep === 2) {
      setFormData({ ...formData, contactScreeningDetails: stepData });
      console.log("Contact Screening Details Saved:", stepData);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      console.log("Final Data Submitted:", formData);
    }
  };

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
            {/* <form onSubmit={handleSubmit(onSubmit)} noValidate> */}
              {activeStep === 0 && (
                <PatientDetailsForm language={language} data={formData.patientDetails} onSave={handleSave} onNext={handleNext}/>
              )}
              {activeStep === 1 && (
                <NikshayDetailsForm language={language} data={formData.nikshayDetails} onSave={handleSave} onNext={handleNext} onBack={handleBack}/>
              )}
              {activeStep === 2 && (
                <ContactScreeningDetailsForm language={language} data={formData.contactScreeningDetails} onSave={handleSave} onSubmit={handleSubmit(onSubmit)} onBack={handleBack}/>
              )}

              {/* <Box mt={3} display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" color="secondary">
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <>
                    <Button variant="contained" color="info" onClick={() => handleSave(formData)}>
                      Save
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      Next
                    </Button>
                  </>
                ) : (
                  <Button type="submit" variant="contained" color="success">
                    Submit
                  </Button>
                )}
              </Box> */}
            {/* </form> */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>
  )
}

export default PatientRegistrationPage