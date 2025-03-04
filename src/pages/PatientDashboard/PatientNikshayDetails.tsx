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
import { DashboardFieldsProp } from "../../components/datatypes/DataTypes";
import { NikshayDetailsFormLabelsData } from "../../components/NikshayDetailsForm/NikshayDetailsForm";
import EditPatientDetailsModal from "../../components/PatientRegistrationModals/EditPatientDetailsModal";

export const renderField = (
  data: any,
  item: DashboardFieldsProp,
  index: number
) => {
  const fieldValue = data[item.name];
  const displayValue =
    fieldValue === true
      ? "Yes"
      : fieldValue === false
      ? "No"
      : fieldValue !== null && fieldValue !== undefined && fieldValue !== ""
      ? fieldValue
      : "N/A";
  const labelText =
    typeof item.label === "string" ? item.label : item.label.label;

  return (
    <Grid item xs={item.size} key={index}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "gray" }}>
        {labelText.toUpperCase()}:
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
        {typeof displayValue === "string" || typeof displayValue === "number"
          ? displayValue
          : "N/A"}
      </Typography>
    </Grid>
  );
};

const PatientNikshayDetails = ({ patientId }: any) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const language = useSelector((state: any) => state.language.language);
  const [labels, setLabels] = useState<NikshayDetailsFormLabelsData>({
    patientNameLabel: "",
    nikshayIdLabel: "",
    udstStatusLabel: { label: "", options: [] },
    dateOfUdstLabel: "",
    resultOfUdstLabel: { label: "", options: [] },
    dbtStatusLabel: { label: "", options: [] },
    dateOfDbtLabel: "",
    nikshayMitraStatusLabel: { label: "", options: [] },
    nikshayMitraDateLabel: "",
    nikshayMitraNameLabel: "",
  });
  const [areDetailsNull, setAreDetailsNull] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/locales/patient_registration_form3_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.nikshaydetailsform || {}))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  const fields = [
    { name: "nikshayId", label: labels.nikshayIdLabel, size: 12 },
    { name: "udstStatus", label: labels.udstStatusLabel, size: 12 },
    { name: "dateOfUdst", label: labels.dateOfUdstLabel, size: 6 },
    { name: "resultOfUdst", label: labels.resultOfUdstLabel, size: 6 },
    { name: "dbtStatus", label: labels.dbtStatusLabel, size: 12 },
    { name: "dateOfDbt", label: labels.dateOfDbtLabel, size: 6 },
    {
      name: "nikshayMitraStatus",
      label: labels.nikshayMitraStatusLabel,
      size: 12,
    },
    { name: "nikshayMitraDate", label: labels.nikshayMitraDateLabel, size: 6 },
    { name: "nikshayMitraName", label: labels.nikshayMitraNameLabel, size: 6 },
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`nikshaymitra/${patientId}`);
      setPatientData(res.data);
      setError(null);
    } catch (err: any) {
      if (err.status == 400) {
        setAreDetailsNull(true);
      }
      setError(
        err.response?.data?.message || "Failed to fetch nikshay details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (areDetailsNull) {
    return (
      <>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Set Nikshay Details
        </Button>
        {modalOpen && (
          <EditPatientDetailsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            prop={"nikshaymitra"}
            patientId={patientId}
            getData={getData}
          />
        )}
      </>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Divider sx={{ mb: 4 }} />
      {patientData ? (
        <Grid container spacing={2} sx={{ padding: "0px 40px" }}>
          {fields.map((item, index) => renderField(patientData, item, index))}
        </Grid>
      ) : (
        <Typography align="center" variant="body2" color="textSecondary">
          Nikshay Details Not found.
        </Typography>
      )}
    </>
  );
};

export default PatientNikshayDetails;
