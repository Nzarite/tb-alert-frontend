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
import { useSelector } from "react-redux";

const PatientFollowUpDetails = ({ patientId, refreshKey }: any) => {
  const [patientData, setPatientData] = useState<
    FollowUpsDataInterface[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<any>(null);
  const language = useSelector((state: any) => state.language.language);
  const [patientConditionLabels, setPatientConditionLabels] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    fetch(`/locales/followup_page_${language}.json`)
      .then((response) => response.json())
      .then((data) => {
        setLabels(data.followuppage);
        setPatientConditionLabels(data.followuppage.patientConditionLabels);
      })
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  const getStatusColor = (dateOfFollowUp: string, followUpStatus: string) => {
    if (followUpStatus === labels?.cancelled) return "primary";

    const today = new Date();
    const dof = new Date(dateOfFollowUp);

    // Normalize both dates to midnight for accurate date-only comparison
    today.setHours(0, 0, 0, 0);
    dof.setHours(0, 0, 0, 0);

    if (dof.getTime() > today.getTime()) return "warning";
    if (dof.getTime() === today.getTime())
      return followUpStatus === labels?.missed ? "warning" : "success";
    return followUpStatus === labels?.missed ? "error" : "success";
  };

  const getStatusName = (dateOfFollowUp: string, followUpStatus: string) => {
    if (followUpStatus === labels?.cancelled) return labels?.cancelled;

    const today = new Date();
    const dof = new Date(dateOfFollowUp);

    // Normalize both dates to midnight
    today.setHours(0, 0, 0, 0);
    dof.setHours(0, 0, 0, 0);

    if (dof.getTime() > today.getTime()) return labels?.scheduled;
    if (dof.getTime() === today.getTime()) {
      return followUpStatus === labels?.missed
        ? labels?.scheduled
        : labels?.captured;
    }
    return followUpStatus === labels?.missed
      ? labels?.missed
      : labels?.captured;
  };

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
                  {labels?.followUp}
                </Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {labels?.date}
                </Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {labels?.status}
                </Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ebebeb" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {labels?.patientCondition}
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
                      <Typography>
                        {labels?.followUp} {index + 1}
                      </Typography>
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
