import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  MdAssessment,
  MdLocalHospital,
  MdMobileFriendly,
  MdPerson,
  MdVaccines,
} from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import PatientContactScreeningDetails from "./PatientContactScreeningDetails";
import PatientFollowUpDetails from "./PatientFollowUpDetails";
import PatientMedicalDetails from "./PatientMedicalDetails";
import PatientMedicineDetails from "./PatientMedicineDetails";
import PatientNikshayDetails from "./PatientNikshayDetails";
import PatientPersonalDetails from "./PatientPersonalDetails";
import EditPatientDetailsModal from "../../components/PatientRegistrationModals/EditPatientDetailsModal";

const PatientDashboardPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
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
  };

  if (!patientId) {
    return <Typography variant="h6">No patient selected</Typography>;
  }

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {[
          {
            title: "Personal Details",
            component: <PatientPersonalDetails patientId={patientId} />,
            icon: <MdPerson style={{ fontSize: "24px" }} />,
            size: 6,
            editURL: null,
            prop: "patient",
          },
          {
            title: "Nikshay Details",
            component: <PatientNikshayDetails patientId={patientId} />,
            icon: <MdMobileFriendly style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
            prop: "nikshaymitra",
          },
          {
            title: "Medical Report",
            component: <PatientMedicalDetails patientId={patientId} />,
            icon: <MdLocalHospital style={{ fontSize: "25px" }} />,
            size: 6,
            editURL: null,
            prop: "tbdetails",
          },
          {
            title: "Medicines",
            component: <PatientMedicineDetails patientId={patientId} />,
            icon: <MdVaccines style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: "",
          },
          {
            title: "Contact Screening",
            component: <PatientContactScreeningDetails patientId={patientId} />,
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: null,
            prop: "contactscreening",
          },
          {
            title: "Follow Up",
            component: <PatientFollowUpDetails patientId={patientId} />,
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: "/visit",
            prop: 1,
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
