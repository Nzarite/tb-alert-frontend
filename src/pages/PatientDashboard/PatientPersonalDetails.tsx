import { Alert, Box, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { renderField } from "./PatientNikshayDetails";

const PatientPersonalDetails = ({ patientId }: any) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = [
    { name: "patientId", label: "Patient ID", size: 12 },
    { name: "firstName", label: "First Name", size: 6 },
    { name: "lastName", label: "Last Name", size: 6 },
    { name: "gender", label: "Gender", size: 6 },
    { name: "dateOfBirth", label: "DOB", size: 6 },
    { name: "phone", label: "Contact", size: 6 },
    { name: "block", label: "Block", size: 6 },
    { name: "gp", label: "Gram Panchayat", size: 6 },
    { name: "village", label: "Village", size: 6 },
    { name: "district", label: "District", size: 6 },
    { name: "currentStatus", label: "Status", size: 6 },
  ];

  useEffect(() => {
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

export default PatientPersonalDetails;
