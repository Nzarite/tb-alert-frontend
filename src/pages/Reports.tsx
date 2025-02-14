import { useState } from "react";
import { 
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  FormControlLabel,
  Switch
} from "@mui/material";
import axiosInstance from "../components/axiosInstance";

const steps = ["Report Filters"];

const Reports = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [cured, setCured] = useState(false);

  const handleUpdateFile = async () => {
    try {
      const filters = {
        age: age ? parseInt(age) : 0,
        gender: gender || null,
        startDate: startDate || null,
        endDate: endDate || null,
        currentStatus: currentStatus || null,
        cured: cured
      };

      await axiosInstance.post("/report/patient/filter", filters);
      console.log("Report file updated successfully in the backend.");
      alert("Patient report updated in local storage.");
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Stepper */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Report Generation
            </Typography>
            <Stepper activeStep={0} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Right Column - Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Set Report Filters
            </Typography>
            
            <Grid container spacing={3}>
              {/* Age Input */}
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

              {/* Gender Dropdown */}
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

              {/* Start Date */}
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

              {/* End Date */}
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

              {/* Current Status Dropdown */}
              <Grid item xs={12} sm={6}>
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

              {/* Cured Toggle Switch */}
              <Grid item xs={12} sm={6} display="flex" alignItems="center">
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

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateFile}
                    sx={{ mt: 2 }}
                    size="large"
                  >
                    Generate Report
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
