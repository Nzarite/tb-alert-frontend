import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
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
import { RootState } from "../../../redux/store";
import DiagnosedWithTB from "../../../components/TbDetailsForm/DiagnosedWithTB";
import { RootState } from "../../../redux/store";

const PatientRegistrationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(
    location.state?.initialStep || 0
  );
  const [patientId, setPatientId] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [snackString,setSnackString]=useState<string>("Patient registered successfully with Personal, TB, Nikshay & Contact Screening details.")

  const auth = useAuth();
  const userEmail =
    useSelector((state: RootState) => state.user?.profile?.email) ||
    auth.user?.profile?.email;
  const userRole = auth.user?.profile.client_roles || {};


  const steps = [
    "Patient Details",
    "Current TB Status",
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

  const language = useSelector((state: any) => state.language.language);

  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Final Submitted Data:", data);
  };
//use switch here instead
  const handleSave = async (stepData: any) => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (activeStep === 0) {
        let createdBy;
        if(stepData.createdBy==="") createdBy=userEmail;
        else createdBy=stepData.createdBy;

        response = await axiosInstance.post("/patient/register", {
          ...stepData,
          createdBy:createdBy
        });
        console.log(stepData);
        if (response.status === 200 || 201 || 202) {
          setPatientId(response.data.patientId);
          setPatientName(
            response.data.firstName +
              (response.data.lastName ? " " + response.data.lastName : "")
          );
          setFormData({ ...formData, patientDetails: stepData });
          setActiveStep(activeStep + 1);
        }
      } else if (activeStep === 1) {
        if (!patientId) {
          throw new Error("Patient ID not found. Please complete step 1.");
        }
        if (stepData.isDiagnosedWithTB === true) {
          setStep1Data(stepData); // Store data temporarily
          setConfirmModalOpen(true); // Open confirmation modal
          setLoading(false);
          return;
        }
        setSnackString("Referal Patient Registered")
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate(`/patient-dashboard/${patientId}`);
        }, 2000);
      } else if (activeStep === 2) {
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
      } else if (activeStep === 3) {
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
      } else if (activeStep === 4) {
        if (!formData.nikshayDetails) {
          throw new Error("Nikshay Details not found. Please complete step 3.");
        }
        response = await axiosInstance.post(`/contactscreening`, {
          ...stepData,
          patientId,
        });
        if (response.status === 200 || 201 || 202) {
          setFormData({ ...formData, contactScreeningDetails: stepData });
          setSnackString("Patient registered successfully with Personal, TB, Nikshay & Contact Screening details.")
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate(`/patient-dashboard/${patientId}`);
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      setError(
        error.response?.data ||
          "There was an error submitting the form, please try again"
      );
    } finally {
      setLoading(false);
    }
  };
const handleConfirm = async (confirmed: boolean) => {
    setConfirmModalOpen(false);

    if (confirmed) {
      // User confirmed, proceed with API call
      const response = await axiosInstance.put(`/patient/update/${patientId}`, {
        ...step1Data,
      });

      if (response.status === 200 || response.status === 201 || response.status === 202) {
        setActiveStep(activeStep + 1);
      }
    }

  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // const handleNext = () => {
  //   if (activeStep < steps.length - 1) {
  //     setActiveStep(activeStep + 1);
  //   } else {
  //     console.log("Final Data Submitted:", stepData);
  //   }
  // };

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
                  // onNext={handleNext}
                  functionality="register"
                  loading={loading}
                />
              )}
              {activeStep === 1 && (
                <DiagnosedWithTB
                  language={language}
                  data={formData.tbDetails}
                  onSave={handleSave}
                  // onNext={handleNext}
                  onBack={handleBack}
                  functionality="register"
                  patientName={patientName}
                  loading={loading}
                />
              )}
              {activeStep === 2 && (
                <TbDetailsForm
                  language={language}
                  data={formData.tbDetails}
                  onSave={handleSave}
                  // onNext={handleNext}
                  onBack={handleBack}
                  functionality="register"
                  patientName={patientName}
                  loading={loading}
                />
              )}
              {activeStep === 3 && (
                <NikshayDetailsForm
                  language={language}
                  data={formData.nikshayDetails}
                  onSave={handleSave}
                  // onNext={handleNext}
                  onBack={handleBack}
                  functionality="register"
                  patientName={patientName}
                  loading={loading}
                />
              )}
              {activeStep === 4 && (
                <ContactScreeningDetailsForm
                  language={language}
                  data={formData.contactScreeningDetails}
                  onSave={handleSave}
                  onSubmit={handleSubmit(onSubmit)}
                  onBack={handleBack}
                  functionality="register"
                  patientName={patientName}
                  loading={loading}
                />
              )}
              {error && (
                <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert severity="success" variant="filled">
                  {snackString}
                </Alert>
              </Snackbar>
            </Paper>
          </Grid>
        </Grid>
        <Dialog open={confirmModalOpen} onClose={() => handleConfirm(false)}>
      <DialogTitle>Confirm Diagnosis</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to proceed with the TB diagnosis?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleConfirm(false)} color="secondary">
          No
        </Button>
        <Button onClick={() => handleConfirm(true)} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
      </Container>
    </>
  );
};

export default PatientRegistrationPage;
