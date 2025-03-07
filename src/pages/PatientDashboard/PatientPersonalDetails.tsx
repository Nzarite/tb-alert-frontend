import { Alert, Box, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../components/axiosInstance";
import { PatientDetailsFormLabelsData } from "../../components/PatientDetailsForm/PatientDetailsForm";
import { renderField } from "./PatientNikshayDetails";

const PatientPersonalDetails = ({ patientId, refreshKey }: any) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const language = useSelector((state: any) => state.language.language);
  const [labels, setLabels] = useState<PatientDetailsFormLabelsData>({
    patientIdLabel: "",
    firstNameLabel: "",
    lastNameLabel: "",
    genderLabel: { label: "", options: [] },
    phoneNumberLabel: "",
    ageLabel: "",
    districtLabel: "",
    villageLabel: "",
    blockLabel: "",
    gpLabel: "",
    consentForMessageLabel: { label: "", options: [] },
    currentStatusLabel: "",
    stateLabel: "",
  });

  useEffect(() => {
    fetch(`/locales/patient_registration_form1_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.patientdetailsform))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  const fields = [
    { name: "patientId", label: labels.patientIdLabel, size: 12 },
    { name: "firstName", label: labels.firstNameLabel, size: 6 },
    { name: "lastName", label: labels.lastNameLabel, size: 6 },
    { name: "gender", label: labels.genderLabel, size: 6 },
    { name: "phoneNumber", label: labels.phoneNumberLabel, size: 6 },
    { name: "age", label: labels.ageLabel, size: 6 },
    { name: "state", label: labels.stateLabel, size: 6 },
    { name: "district", label: labels.districtLabel, size: 6 },
    { name: "village", label: labels.villageLabel, size: 6 },
    { name: "block", label: labels.blockLabel, size: 6 },
    { name: "gp", label: labels.gpLabel, size: 6 },
    {
      name: "consentForMessage",
      label: labels.consentForMessageLabel,
      size: 6,
    },
    { name: "currentStatus", label: labels.currentStatusLabel, size: 6 },
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`patient/${patientId}`);
      setPatientData(res.data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch patient details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [patientId, refreshKey]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <Skeleton variant="text" sx={{ mt: 1, width: "60%" }} />
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
          Unable to fetch data
        </Typography>
      )}
    </>
  );
};

export default PatientPersonalDetails;
