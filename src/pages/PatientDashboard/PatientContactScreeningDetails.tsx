import { Alert, Box, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { renderField } from "./PatientNikshayDetails";
import { ContactScreeningDetailsFormLabelsData } from "../../components/ContactScreeningDetailsForm/ContactScreeningDetailsForm";
import { useSelector } from "react-redux";

const PatientContactScreeningDetails = ({ patientId }: any) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const language = useSelector((state:any) => state.language.language)
  const [labels, setLabels] = useState<ContactScreeningDetailsFormLabelsData>({
      patientNameLabel: "",
      contactScreeningDoneLabel: { label: "", options: [] },
      dateOfContactScreeningLabel: "",
      noOfHHCsAvailableLabel: "",
      noOfHHCsScreenedLabel: "",
      noOfHHCsWithTBSymptomsLabel: "",
      noOfHHCsReferredTBTestingLabel: "",
      noOfHHCsDiagnosedTBLabel: "",
      noOfHHCsTBInitiatedATTLabel: "",
      noOfHHCsUndergoneLTBITestLabel: "",
      noOfEligibleForTPTLabel: "",
      noOfHHCsInitiatedTPTLabel: "",
    });
  
    useEffect(() => {
      fetch(`/locales/patient_registration_form4_${language}.json`)
        .then((response) => response.json())
        .then((data) => setLabels(data.nikshaydetailsform))
        .catch((error) => {
          console.error("Error loading form labels file:", error);
          alert("Failed to load form labels data. Please try again.");
        });
    }, [language]);

  const fields = [
    { name: "contactScreeningDone", label: labels.contactScreeningDoneLabel, size: 12 },
    {
      name: "dateOfContactScreening",
      label: labels.dateOfContactScreeningLabel,
      size: 6,
    },
    {
      name: "noOfHHCsAvailable",
      label: labels.noOfHHCsAvailableLabel,
      size: 6,
    },
    { name: "noOfHHCsScreened", label: labels.noOfHHCsScreenedLabel, size: 6 },
    {
      name: "noOfHHCsWithTBSymptoms",
      label: labels.noOfHHCsWithTBSymptomsLabel,
      size: 6,
    },
    {
      name: "noOfHHCsReferredTBTesting",
      label: labels.noOfHHCsReferredTBTestingLabel,
      size: 6,
    },
    {
      name: "noOfHHCsDiagnosedTB",
      label: labels.noOfHHCsDiagnosedTBLabel,
      size: 6,
    },
    {
      name: "noOfHHCsTBInitiatedATT",
      label: labels.noOfHHCsTBInitiatedATTLabel,
      size: 6,
    },
    {
      name: "noOfHHCsUndergoneLTBITest",
      label: labels.noOfHHCsUndergoneLTBITestLabel,
      size: 6,
    },
    {
      name: "noOfEligibleForTPT",
      label: labels.noOfEligibleForTPTLabel,
      size: 6,
    },
    {
      name: "noOfHHCsInitiatedTPT",
      label: labels.noOfHHCsInitiatedTPTLabel,
      size: 6,
    },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`contactscreening/${patientId}`);
        setPatientData(res.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch contact screening details"
        );
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [patientId]);

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
          Contact Screening Details not found
        </Typography>
      )}
    </>
  );
};

export default PatientContactScreeningDetails;
