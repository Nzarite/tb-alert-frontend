import {
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ContactScreeningDetailsForm, {
  ContactScreeningData,
} from "../../../components/ContactScreeningDetailsForm/ContactScreeningDetailsForm";
import NikshayDetailsForm, {
  NikshayDetailsData,
} from "../../../components/NikshayDetailsForm/NikshayDetailsForm";
import PatientDetailsForm, {
  PatientDetailsData,
} from "../../../components/PatientDetailsForm/PatientDetailsForm";
import TbDetailsForm, {
  TbDetailsData,
} from "../../../components/TbDetailsForm/TbDetailsForm";
import axiosInstance from "../../../components/axiosInstance";

const PatientRegistrationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(
    location.state?.initialStep || 0
  );
  const [patientId, setPatientId] = useState<string | null>(null);

  const auth = useAuth();
  const userEmail =
    useSelector((state) => state.user.profile.email) ||
    auth.user?.profile.email;

  const steps = [
    "Patient Details",
    "TB Details",
    "Nikshay Details",
    "Contact Screening Details",
  ];

  const [formData, setFormData] = useState({
    patientDetails: {} as PatientDetailsData,
    tbDetails: {} as TbDetailsData,
    nikshayDetails: {} as NikshayDetailsData,
    contactScreeningDetails: {} as ContactScreeningData,
  });

  const language = useSelector((state: any) => state.language);

  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Final Submitted Data:", data);
  };

  const handleSave = async (stepData: any) => {
    try {
      const formData = { ...stepData, createdBy: userEmail };
      let response;

      if (activeStep === 0) {
        response = await axiosInstance.post("/patient/register", formData);
        if (response.status === 200 || 201 || 202) {
          setPatientId(response.data.patientId);
          setFormData({ ...formData, patientDetails: formData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 1) {
        if (!patientId) {
          throw new Error("Patient ID not found. Please complete step 1.");
        }
        response = await axiosInstance.post("/tbdetails/register", {
          ...formData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, tbDetails: formData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 2) {
        if (!formData.tbDetails) {
          throw new Error("TB Details not found. Please complete step 2.");
        }
        response = await axiosInstance.post("/nikshaymitra/register", {
          ...formData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, nikshayDetails: formData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 3) {
        if (!formData.nikshayDetails) {
          throw new Error("Nikshay Details not found. Please complete step 3.");
        }
        response = await axiosInstance.post("/contactscreening/save", {
          ...formData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, contactScreeningDetails: formData });
          navigate(`/patient-dashboard/${patientId}`);
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
                  functionality="register"
                />
              )}
              {activeStep === 1 && (
                <TbDetailsForm
                  language={language}
                  data={formData.tbDetails}
                  onSave={handleSave}
                  onBack={handleBack}
                  functionality="register"
                />
              )}
              {activeStep === 2 && (
                <NikshayDetailsForm
                  language={language}
                  data={formData.nikshayDetails}
                  onSave={handleSave}
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
