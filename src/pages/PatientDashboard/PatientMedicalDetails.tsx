import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../components/axiosInstance";
import EditPatientDetailsModal from "../../components/PatientRegistrationModals/EditPatientDetailsModal";
import { TbDetailsFormLabelsData } from "../../components/TbDetailsForm/TbDetailsForm";
import { renderField } from "./PatientNikshayDetails";

const PatientMedicalDetails = ({ patientId, refresh }: any) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const language = useSelector((state: any) => state.language.language);
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
  const [areDetailsNull, setAreDetailsNull] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/locales/patient_registration_form2_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.tbdetailsform))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  const fields = [
    { name: "dateOfDiagnosis", label: labels.dateOfDiagnosisLabel, size: 6 },
    {
      name: "dateOfTreatmentInitiation",
      label: labels.dateOfTreatmentInitiationLabel,
      size: 6,
    },
    { name: "typeOfPwtb", label: labels.typeOfPwtbLabel, size: 6 },
    {
      name: "clinicalOrMicrobiological",
      label: labels.clinicalOrMicrobiologicalLabel,
      size: 6,
    },
    { name: "typeOfTb", label: labels.typeOfTbLabel, size: 6 },
    { name: "dstbOrDrtb", label: labels.dstbOrDrtbLabel, size: 6 },
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`tbdetails/${patientId}`);
      setPatientData(res.data);
      setError(null);
    } catch (err: any) {
      if (err.status == 400) {
        setAreDetailsNull(true);
      }
      setError(
        err.response?.data?.message || "Failed to fetch patient medical details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [patientId, refresh]);

  const handleModalClose = () => {
    setModalOpen(false);
    getData();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="text" sx={{ mt: 1, width: "60%" }} />
      </Box>
    );
  }

  if (areDetailsNull && !patientData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          m: 5,
        }}
      >
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Set TB Details
        </Button>
        <EditPatientDetailsModal
          open={modalOpen}
          onClose={handleModalClose}
          prop={"tbdetails"}
          patientId={patientId}
        />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Divider sx={{ mb: 4 }} />
      {patientData ? (
        <Grid container spacing={3} sx={{ padding: "0px 40px" }}>
          {fields.map((item, index) => renderField(patientData, item, index))}
        </Grid>
      ) : (
        <Typography align="center" variant="body2" color="textSecondary">
          Medical Records not found
        </Typography>
      )}
    </>
  );
};

export default PatientMedicalDetails;
