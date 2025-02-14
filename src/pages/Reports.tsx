import { useState } from "react";
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
  Switch
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";

const Reports = () => {
  const [currentRole, setCurrentRole] = useState("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [cured, setCured] = useState(null);

  const handleDownloadReport = async (endpoint, filename) => {
    try {

      let filters = {
        age: age ? parseInt(age) : 0,
        gender: gender || null,
        startDate: startDate || null,
        endDate: endDate || null,
        currentStatus: currentStatus || null,
        cured: cured
      };

      if(filename==="All_Patient_Reports.xlsx")
      {
        filters={
          age:0,
          gender:null,
          startDate:null,
          endDate:null,
          currentStatus:null,
          cured:null
        }
      }

      const response = await axiosInstance.post(endpoint, filters, {
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
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
              <MenuItem value="telecaller">TeleCaller</MenuItem>
            </TextField>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Set Report Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6} sx={{ display: currentRole === "patient" ? "block" : "none" }}>
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
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: currentRole === "patient" ? "block" : "none" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cured}
                      onChange={(e) => setCured(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Cured"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownloadReport("/report/patient/filter", "Patient_Report.xlsx")}
                    size="large"
                  >
                    Download Report
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDownloadReport("/report/patient/filter", "All_Patient_Reports.xlsx")}
                    size="large"
                  >
                    Download All Reports
                  </Button>
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
