import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import PatientDetailsForm from "../../../components/PatientDetailsForm/PatientDetailsForm";
import TbDetailsForm from "../../../components/TbDetailsForm/TbDetailsForm";
import NikshayDetailsForm from "../../../components/NikshayDetailsForm/NikshayDetailsForm";
import ContactScreeningDetailsForm from "../../../components/ContactScreeningDetailsForm/ContactScreeningDetailsForm";
import { PatientDetailsData } from "../../../components/PatientDetailsForm/PatientDetailsForm";
import { TbDetailsData } from "../../../components/TbDetailsForm/TbDetailsForm";
import { NikshayDetailsData } from "../../../components/NikshayDetailsForm/NikshayDetailsForm";
import { ContactScreeningData } from "../../../components/ContactScreeningDetailsForm/ContactScreeningDetailsForm";
import axiosInstance from "../../../components/axiosInstance";
import { useSelector } from "react-redux";

const PatientRegistrationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(
    location.state?.initialStep || 0
  );
  const [patientId, setPatientId] = useState<string | null>(null);

  const steps = [
    "Patient Details",
    "TB Details",
    "Nikshay Details",
    "Contact Screening Details",
  ];

  // const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    patientDetails: {} as PatientDetailsData,
    tbDetails: {} as TbDetailsData,
    nikshayDetails: {} as NikshayDetailsData,
    contactScreeningDetails: {} as ContactScreeningData,
  });

  // const [language, setLanguage] = useState("en");

  const language = useSelector((state: any) => state.language);
  console.log(language);

  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Final Submitted Data:", data);
  };

  console.log(activeStep);

  const handleSave = async (stepData: any) => {
    // if (activeStep === 0) {
    //   setFormData({ ...formData, patientDetails: stepData });
    //   console.log("Patient Details Saved:", stepData);
    // } else if (activeStep === 1) {
    //   setFormData({ ...formData, tbDetails: stepData });
    //   console.log("TB Details Saved:", stepData);
    // } else if (activeStep === 2) {
    //   setFormData({ ...formData, nikshayDetails: stepData });
    //   console.log("Nikshay Details Saved:", stepData);
    // } else if (activeStep === 3) {
    //   setFormData({ ...formData, contactScreeningDetails: stepData });
    //   console.log("Contact Screening Details Saved:", stepData);
    // }

    try {
      let response;

      if (activeStep === 0) {
        response = await axiosInstance.post("/patient/register", stepData);
        if (response.status === 200 || 201 || 202) {
          setPatientId(response.data.patientId);
          setFormData({ ...formData, patientDetails: stepData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 1) {
        if (!patientId) {
          throw new Error("Patient ID not found. Please complete step 1.");
        }
        response = await axiosInstance.post("/tbdetails/register", {
          ...stepData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, tbDetails: stepData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 2) {
        if (!formData.tbDetails) {
          throw new Error("TB Details not found. Please complete step 2.");
        }
        response = await axiosInstance.post("/nikshaymitra/register", {
          ...stepData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, nikshayDetails: stepData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 3) {
        if (!formData.nikshayDetails) {
          throw new Error("Nikshay Details not found. Please complete step 3.");
        }
        response = await axiosInstance.post("/contactscreening/save", {
          ...stepData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, contactScreeningDetails: stepData });
          navigate(`/dashboard/patient/${patientId}`);
        }
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
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
              {activeStep === 0 && (
                <PatientDetailsForm
                  language={language}
                  data={formData.patientDetails}
                  onSave={handleSave}
                  onNext={handleNext}
                  functionality="register"
                />
              )}
              {activeStep === 1 && (
                <TbDetailsForm
                  language={language}
                  data={formData.tbDetails}
                  onSave={handleSave}
                  onNext={handleNext}
                  onBack={handleBack}
                  functionality="register"
                />
              )}
              {activeStep === 2 && (
                <NikshayDetailsForm
                  language={language}
                  data={formData.nikshayDetails}
                  onSave={handleSave}
                  onNext={handleNext}
                  onBack={handleBack}
                  functionality="register"
                />
              )}
              {activeStep === 3 && (
                <ContactScreeningDetailsForm
                  language={language}
                  data={formData.contactScreeningDetails}
                  onSave={handleSave}
                  onSubmit={handleSubmit(onSubmit)}
                  onBack={handleBack}
                  functionality="register"
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PatientRegistrationPage;
