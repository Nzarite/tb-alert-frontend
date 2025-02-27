import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";
import { useSelector } from "react-redux";
import { useAuth } from "react-oidc-context";

const Reports = () => {
  const auth = useAuth();
  const userEmail =
    useSelector((state: any) => state.user?.profile?.email) ||
    auth.user?.profile.email;
    const userRole = auth.user?.profile.client_roles || [];
    console.log(auth);

  const [currentRole, setCurrentRole] = useState("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [state, setState] = useState<string>("");
  const [dsOrDr, setDsOrDr] = useState<string>("");
  const [udstStatus, setUdstStatus] = useState<boolean | "">("");
  const [dbtStatus, setDbtStatus] = useState<boolean | "">("");
  const [createdBy, setCreatedBy] = useState<string>("");

  const handleTeleCallerReport = async () => {
    try {
      const body = {
        state: state,
      };
      const response = await axiosInstance.post("/report/telecaller", body, {
        responseType: "blob",
      });
      blodHandler(response.data, "TelecallerReports.xlsx");
    } catch (error) {
      console.error(error);
    }
  };

  const handleStateHeadReports = async () => {
    try {
      const response = await axiosInstance.post(
        "/report/statehead",
        {},
        { responseType: "blob" }
      );
      blodHandler(response.data, "StateHeadDetails.xlsx");
    } catch (error) {
      console.error(error);
    }
  };
  const blodHandler = (data: any, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const handleDownloadReport = async (endpoint: string, filename: string) => {
    try {
      const filters = {
        age: age ? parseInt(age) : 0,
        gender: gender || null,
        startDate: startDate || null,
        endDate: endDate || null,
        currentStatus: currentStatus || null,
        state: state,
        dstbOrDrtb: dsOrDr,
        udstStatus: udstStatus,
        dbtStatus: dbtStatus,
      };

      const response = await axiosInstance.post(endpoint, filters, {
        responseType: "blob",
      });
      blodHandler(response.data, filename);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const handleFollowUpForToday = async () => {
    try {
      const response = await axiosInstance.post(
        "/report/patient/followup/today",
        {
          state: state,
          createdBy: createdBy === "self" ? userEmail : "",
        },
        {
          responseType: "blob",
        }
      );
      blodHandler(response.data, "FollowUpsForToday.xlsx");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearFilters = () => {
    setAge("");
    setGender("");
    setStartDate("");
    setEndDate("");
    setCurrentStatus("");
    setState("");
    setDsOrDr("");
    setUdstStatus("");
    setDbtStatus("");
    setCreatedBy("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Report Generation
            </Typography>
            <TextField
              fullWidth
              select
              label="Role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              
              <MenuItem value="patient">Patient</MenuItem>

              {(userRole.includes("StateCoordinator") ||
                userRole.includes("SuperAdmin")) && (
                <MenuItem value="telecaller">TeleCaller</MenuItem>
              )}

              {/* Show State Head only for superadmin */}
              {userRole.includes("SuperAdmin") && (
                <MenuItem value="statehead">State Head</MenuItem>
              )}
              <MenuItem value="followup">Follow Up</MenuItem>
            </TextField>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Set Report Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display:
                    currentRole === "patient" ||
                    currentRole === "telecaller" ||
                    currentRole === "followup"
                      ? "block"
                      : "none",
                }}
              >
                <TextField
                  fullWidth
                  select
                  label="State"
                  InputLabelProps={{ shrink: true }}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="TELANGANA">Telangana</MenuItem>
                  <MenuItem value="UTTAR PRADESH">Uttar Pradesh</MenuItem>
                  <MenuItem value="BIHAR">Bihar</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  select
                  label="Current Status"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="dead">Deceased</MenuItem>
                  <MenuItem value="alive">Under Treatment</MenuItem>
                  <MenuItem value="cured">Cured </MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  select
                  label="UDST Status"
                  value={udstStatus}
                  onChange={(e) =>
                    setUdstStatus(
                      e.target.value === "" ? "" : e.target.value === "true"
                    )
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="false">Not Done</MenuItem>
                  <MenuItem value="true">Done</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  select
                  label="DBT Status"
                  value={dbtStatus}
                  onChange={(e) =>
                    setDbtStatus(
                      e.target.value === "" ? "" : e.target.value === "true"
                    )
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="false">Not Done</MenuItem>
                  <MenuItem value="true">Done</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "patient" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  select
                  label="DS-TB or DR-TB"
                  value={dsOrDr}
                  onChange={(e) => setDsOrDr(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="DS-TB">DS-TB</MenuItem>
                  <MenuItem value="DR-TB">DR-TB</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: currentRole === "followup" ? "block" : "none" }}
              >
                <TextField
                  fullWidth
                  select
                  label="Created By"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="self">Self</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleClearFilters}
                        size="large"
                      >
                        Clear Filters
                      </Button>
                  {currentRole === "patient" && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleDownloadReport(
                            "/report/patient/filter",
                            "Patient_Report.xlsx"
                          )
                        }
                        size="large"
                      >
                        Download Patients Report
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleDownloadReport(
                            "/report/patient/followup",
                            "Patient_FollowUps.xlsx"
                          )
                        }
                        size="large"
                      >
                        Download Patients FollowUp Reports
                      </Button>
                      
                    </>
                  )}
                  {currentRole === "telecaller" && (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleTeleCallerReport()}
                        size="large"
                      >
                        Download TeleCaller Reports
                      </Button>
                    </>
                  )}
                  {currentRole === "followup" && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleFollowUpForToday()}
                      size="large"
                    >
                      Download FollowUps for Today
                    </Button>
                  )}
                  {currentRole === "statehead" && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleStateHeadReports()}
                      size="large"
                    >
                      Download StateHeads Reports
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;
