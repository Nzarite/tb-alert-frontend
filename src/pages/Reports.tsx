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
import { StateOption } from "../components/datatypes/DataTypes";
import { Role } from "../components/Authorization/Roles/Types";

const Reports = () => {
  const auth = useAuth();
  const userEmail =
    useSelector((state: any) => state.user?.profile?.email) ||
    auth.user?.profile.email;
  const userRole: Role[] = useSelector(
    (state: any) =>
      state.user?.profile?.client_roles || auth?.user?.profile?.client_roles
  ) as Role[];

  const userState =
    useSelector((state: any) => state.user?.userState) ||
    localStorage.getItem("userState");
  console.log(userState, userRole);

  const language = useSelector((state: any) => state.language.language);
  const [currentRole, setCurrentRole] = useState("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [state, setState] = useState<StateOption[]>([]);
  const [availableStates, setAvailableStates] = useState<StateOption[]>([]);
  const [backendStates, setBackendStates] = useState<string[]>([]);
  const [filteredStates, setFilteredStates] = useState<StateOption[]>([]);
  const [dsOrDr, setDsOrDr] = useState<string>("");
  const [udstStatus, setUdstStatus] = useState<boolean | "">("");
  const [dbtStatus, setDbtStatus] = useState<boolean | "">("");
  const [createdBy, setCreatedBy] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState("");
  console.log(userState);

  useEffect(() => {
    fetch(`/locales/states_${language}.json`)
      .then((response) => response.json())
      .then((data) => setAvailableStates(data.stateslist))
      .catch((err) => {
        console.error("Error fetching states:", err);
        alert("Failed to load states data. Please try again.");
      });
  }, [language]);

  const fetchStates = async () => {
    try {
      const response = await axiosInstance.get("/state/all");
      const stateNames = response.data.map(
        (state: { stateName: string }) => state.stateName
      );

      setBackendStates(stateNames);
    } catch (error:any) {
      if(error.status === 401) setBackendStates(userState)
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (backendStates.length > 0) {
      const filtered = availableStates.filter((state) =>
        backendStates.includes(state.value)
      );
      setFilteredStates(filtered);
    }
  }, [backendStates, availableStates]);

  useEffect(() => {
    if (userRole.length === 5 && userRole.includes("SuperAdmin"))
      setState([{ label: "All", value: "" }, ...filteredStates]);
    else if (
      (userRole.length === 1 && userRole.includes("Telecaller")) ||
      (userRole.length == 4 && userRole.includes("StateCoordinator"))
    )
      setState(filteredStates.filter((option) => option.value === userState));
    if (
      userRole.includes("SuperAdmin") ||
      userRole.includes("StateCoordinator")
    )
      setCreatedBy("");
  }, [userRole, filteredStates, userState]);

  useEffect(() => {
    if (
      state.length > 0 &&
      ((userRole.length === 1 && userRole.includes("Telecaller")) ||
        (userRole.length == 4 && userRole.includes("StateCoordinator")))
    )
      setSelectedState(state[0].value);
  }, [userRole, state]);

  const handleTeleCallerReport = async () => {
    try {
      const filters = {
        age: age ? parseInt(age) : 0,
        gender: gender || null,
        startDate: startDate || null,
        endDate: endDate || null,
        currentStatus: currentStatus || null,
        state: selectedState,
        dstbOrDrtb: dsOrDr,
        udstStatus: udstStatus,
        dbtStatus: dbtStatus,
        isDeleted: isDeleted,
      };
      const response = await axiosInstance.post("/report/telecaller", filters, {
        responseType: "blob",
      });
      blodHandler(response.data, "TelecallerReports.xlsx");
    } catch (error) {
      console.error(error);
    }
  };

  const handleStateHeadReports = async () => {
    try {
      const filters = {
        age: age ? parseInt(age) : 0,
        gender: gender || null,
        startDate: startDate || null,
        endDate: endDate || null,
        currentStatus: currentStatus || null,
        state: selectedState,
        dstbOrDrtb: dsOrDr,
        udstStatus: udstStatus,
        dbtStatus: dbtStatus,
        isDeleted: isDeleted,
      };
      const response = await axiosInstance.post("/report/statehead", filters, {
        responseType: "blob",
      });
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
        state: selectedState,
        dstbOrDrtb: dsOrDr,
        udstStatus: udstStatus,
        dbtStatus: dbtStatus,
        isDeleted: isDeleted,
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
          state: selectedState,
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
    if (
      !(userRole.length === 1 && userRole.includes("Telecaller")) &&
      !(userRole.length == 4 && userRole.includes("StateCoordinator"))
    )
      setSelectedState("");
    setDsOrDr("");
    setUdstStatus("");
    setDbtStatus("");
    if (
      !userRole.includes("SuperAdmin") &&
      !userRole.includes("StateCoordinator")
    )
      setCreatedBy("");
    setIsDeleted("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Report Generation
            </Typography>
            <TextField
              fullWidth
              select
              label="Type"
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
                  value={selectedState}
                  disabled={
                    (userRole.length === 1 &&
                      userRole.includes("Telecaller")) ||
                    (userRole.length == 4 &&
                      userRole.includes("StateCoordinator"))
                  }
                  onChange={(e) => setSelectedState(e.target.value)}
                  variant="outlined"
                >
                  {state?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
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
                  disabled={
                    userRole.includes("SuperAdmin") ||
                    userRole.includes("StateCoordinator")
                  }
                  onChange={(e) => setCreatedBy(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="self">Self</MenuItem>
                </TextField>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display:
                    currentRole === "patient" || "statehead" || "telecaller"
                      ? "block"
                      : "none",
                }}
              >
                <TextField
                  fullWidth
                  select
                  label={currentRole === "patient" ? "Deleted" : "Removed"}
                  value={isDeleted}
                  disabled={currentRole === "followup"}
                  onChange={(e) => setIsDeleted(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
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
