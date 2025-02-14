import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBox from "../../components/SearchBox";

const PatientSearchPage = () => {
  const navigate = useNavigate();

  const handleSearchChange = (selectedPatient: { value: string; label: string }) => {
    if (selectedPatient?.value) {
      navigate(`/dashboard/patient/${selectedPatient.value}`);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* <Typography variant="h4" sx={{ mb: 2 }}>Search for a Patient</Typography> */}
      <SearchBox changeSearch={handleSearchChange} />
    </Box>
  );
};

export default PatientSearchPage;
