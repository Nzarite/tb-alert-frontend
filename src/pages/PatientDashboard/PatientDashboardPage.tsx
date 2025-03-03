import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import {
  MdAssessment,
  MdLocalHospital,
  MdMobileFriendly,
  MdPerson,
  MdVaccines,
} from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import EditPatientDetailsModal from "../../components/PatientRegistrationModals/EditPatientDetailsModal";
import axiosInstance from "../../components/axiosInstance";
import PatientContactScreeningDetails from "./PatientContactScreeningDetails";
import PatientFollowUpDetails from "./PatientFollowUpDetails";
import PatientMedicalDetails from "./PatientMedicalDetails";
import PatientMedicineDetails from "./PatientMedicineDetails";
import PatientNikshayDetails from "./PatientNikshayDetails";
import PatientPersonalDetails from "./PatientPersonalDetails";

const PatientDashboardPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  // const [patientId, setPatientId] = useState<number | null>();
  const navigate = useNavigate();

  const handleEditClick = (section: any) => {
    if (section.editURL) {
      navigate(section.editURL, { state: { prop: section.prop } });
    } else {
      setSelectedPatientData(section.prop);
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPatientData(null);
    setRefreshData((prev) => !prev);
  };

  const handlePatientDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    try {
      await axiosInstance.delete(`/patient/${patientId}`);
      alert("Patient deleted successfully.");
      console.log(`Patient ${patientId} deleted successfully.`);
    } catch (Error) {
      alert("Failed to delete patient. Please try again.");
      console.log(Error);
    }
  };

  if (!patientId) {
    return <Typography variant="h6">No patient selected</Typography>;
  }

  return (
    <>
      <Button onClick={handlePatientDelete}>Delete Patient</Button>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {[
          {
            title: "Personal Details",
            component: <PatientPersonalDetails patientId={patientId} refresh={refreshData}/>,
            icon: <MdPerson style={{ fontSize: "24px" }} />,
            size: 6,
            editURL: null,
            prop: "patient",
          },
          {
            title: "Nikshay Details",
            component: <PatientNikshayDetails patientId={patientId} refresh={refreshData}/>,
            icon: <MdMobileFriendly style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
            prop: "nikshaymitra",
          },
          {
            title: "Medical Report",
            component: <PatientMedicalDetails patientId={patientId} refresh={refreshData}/>,
            icon: <MdLocalHospital style={{ fontSize: "25px" }} />,
            size: 6,
            editURL: null,
            prop: "tbdetails",
          },
          {
            title: "Contact Screening",
            component: <PatientContactScreeningDetails patientId={patientId} refresh={refreshData}/>,
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: null,
            prop: "contactscreening",
          },
          {
            title: "Medicines",
            component: <PatientMedicineDetails patientId={patientId} />,
            icon: <MdVaccines style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
          },
          {
            title: "Follow Up",
            component: <PatientFollowUpDetails patientId={patientId} />,
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: "/visit",
            prop: patientId,
          },
        ].map((section, index) => (
          <Grid item xs={12} sm={section.size} key={index}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                overflowY: "auto",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {section.icon}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2, color: "#1976d2" }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                <RiPencilLine
                  style={{ fontSize: "20px" }}
                  onClick={() => handleEditClick(section)}
                />
              </Box>
              {section.component}
            </Paper>
          </Grid>
        ))}
      </Grid>
      {modalOpen && selectedPatientData && (
        <EditPatientDetailsModal
          open={modalOpen}
          onClose={handleModalClose}
          prop={selectedPatientData}
          patientId={patientId}
        />
      )}
    </>
  );
};

export default PatientDashboardPage;
