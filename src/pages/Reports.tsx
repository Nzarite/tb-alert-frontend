import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import { useState } from "react";
import * as XLSX from "xlsx";

function Reports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleDownload = () => {
    const data = [
      { id: 1, description: "Sample item 1", date: startDate },
      { id: 2, description: "Sample item 2", date: endDate },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const formattedStartDate = startDate.replace(/-/g, "");
    const formattedEndDate = endDate.replace(/-/g, "");
    saveAs(
      blob,
      `report_${reportType}_${formattedStartDate}_${formattedEndDate}.xlsx`
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <Typography variant="h5">View Patient Records</Typography>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "300px",
          margin: "0 auto",
          mt: 10,
        }}
      >
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          inputProps={{max: endDate || today}}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          inputProps={{min: startDate, max: today }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="report-type-label">Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            value={reportType}
            label="Report Type"
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="sales">Still Under Treatment</MenuItem>
            <MenuItem value="inventory">Treated And Cured</MenuItem>
            <MenuItem value="finance">Died During Treatment</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleDownload}
          disabled={!startDate || !endDate || !reportType}
        >
          Download Report
        </Button>
      </Box>
    </Box>
  );
}

export default Reports;
