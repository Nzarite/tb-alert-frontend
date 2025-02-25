import {
  Alert,
  Box,
  Chip,
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
import { FollowUpsDataInterface } from "../../components/datatypes/DataTypes";
import { patientConditionLabels } from "../FollowUp/FollowUpMain";
import { getStatusColor, getStatusName } from "../FollowUp/FollowUpSidebar";

const PatientFollowUpDetails = ({ patientId }: any) => {
    const [patientData, setPatientData] = useState<FollowUpsDataInterface[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`followup/${patientId}`);
        setPatientData(res.data.followUpDetails);
        setError(null);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch follow up details"
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

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>Follow Up</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>Date</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>Status</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Patient Condition
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientData && patientData.length > 0 ? (
              patientData.map(
                (followup: FollowUpsDataInterface, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography>Follow up {index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{followup.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusName(
                          followup.date,
                          followup.followUpStatus
                        )}
                        color={getStatusColor(
                          followup.date,
                          followup.followUpStatus
                        )}
                        variant="filled"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.65rem",
                          height: 20,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {patientConditionLabels[followup.patientCondition]}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No Follow Ups Found. Please register TB Details.
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

export default PatientFollowUpDetails;
