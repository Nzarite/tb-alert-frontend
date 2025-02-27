import React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const patients = [
  { id: "1", name: "abc", phone: "1234567890", status: "Delivered" },
  { id: "2", name: "bcd", phone: "9876543210", status: "Read" },
  { id: "3", name: "xyz", phone: "9191911234", status: "Read" },
];

const SmsModulePage = () => {
  const [filters, setFilters] = useState({ id: "", name: "" });

  const handleFilterChange = (name: "id" | "name", value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.id.toLowerCase().includes(filters.id.toLowerCase()) &&
      patient.name.toLowerCase().includes(filters.name.toLowerCase())
  );

  return (
    <>
      <Typography variant="h5" sx={{ padding: 2 }}>
        SMS Report
      </Typography>
      <Paper sx={{ padding: 2, ml: 2, mr: 2 }}>
        <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
          <TextField
            label="Filter by Patient ID"
            variant="outlined"
            name="id"
            value={filters.id}
            onChange={(e) => handleFilterChange("id", e.target.value)}
            size="small"
          />
          <TextField
            label="Filter by Patient Name"
            variant="outlined"
            name="name"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            size="small"
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{ "& .MuiTableCell-root": { fontSize: "0.90rem" } }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.status}</TableCell>
                </TableRow>
              ))}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default SmsModulePage;
