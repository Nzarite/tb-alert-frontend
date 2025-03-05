import {
  Alert,
  Box,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { MedicationInterface } from "../../components/datatypes/DataTypes";

const PatientMedicineDetails = ({ patientId, refreshKey }: any) => {
  const [patientData, setPatientData] = useState<MedicationInterface[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`patientmedication/${patientId}`);
        setPatientData(res.data);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch patient medicine details"
        );
      } finally {
        setLoading(false);
      }
    };

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

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Medication Name
                </Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>Frequency</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientData && patientData.length > 0 ? (
              patientData.map((medicine, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography>{medicine.medicationName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{medicine.frequency}</Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No Medications Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PatientMedicineDetails;
