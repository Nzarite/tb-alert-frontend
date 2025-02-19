import { Alert, Box, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { renderField } from "./PatientNikshayDetails";

const PatientMedicalDetails = ({ patientId }: any) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = [
    { name: "dateOfDiagnosis", label: "Date of Diagnosis", size: 6 },
    {
      name: "dateOfTreatmentInitiation",
      label: "Date of Treatment Initiation",
      size: 6,
    },
    { name: "typeOfPwtb", label: "Type of PwTB", size: 6 },
    { name: "typeOfTb", label: "Type of TB", size: 6 },
    { name: "dstbOrDrtb", label: "DSTB/DRTB", size: 6 },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`tbdetails/${patientId}`);
        setPatientData(res.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch patient medical details"
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
          Unable to fetch data
        </Typography>
      )}
    </>
  );
};

export default PatientMedicalDetails;
