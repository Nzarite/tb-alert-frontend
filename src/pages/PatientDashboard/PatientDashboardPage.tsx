import DeleteIcon from "@mui/icons-material/Delete";
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
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router-dom";
import DeletePersonModal from "../../components/PatientDeletionModals/DeletePersonModal";
import EditPatientDetailsModal from "../../components/PatientRegistrationModals/EditPatientDetailsModal";
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
  // const [patientId, setPatientId] = useState<number | null>();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const roles: string[] = useAuth().user?.profile.client_roles as string[];
  const isAdmin = roles.includes("SuperAdmin");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditClick = (section: any) => {
    console.log(section);
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
    setRefreshKey((prevKey: number) => prevKey + 1);
  };

  if (!patientId) {
    return <Typography variant="h6">No patient selected</Typography>;
  }

  return (
    <>
      {isAdmin && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            pr: 2,
          }}
        >
          <Button
            color="error"
            variant="contained"
            onClick={() => setDeleteModalOpen(true)}
          >
            <DeleteIcon />
          </Button>

          <DeletePersonModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            deleteUrl={`patient/${patientId}`}
            navigateUrl="/patient-dashboard"
            person={"Patient"}
          />
        </Box>
      )}

      <Grid container spacing={2} sx={{ p: 2 }}>
        {[
          {
            title: "Personal Details",
            component: (
              <PatientPersonalDetails
                patientId={patientId}
                refreshKey={refreshKey}
              />
            ),
            icon: <MdPerson style={{ fontSize: "24px" }} />,
            size: 6,
            editURL: null,
            prop: "patient",
          },
          {
            title: "Nikshay Details",
            component: (
              <PatientNikshayDetails
                patientId={patientId}
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
              />
            ),
            icon: <MdMobileFriendly style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
            prop: "nikshaymitra",
          },
          {
            title: "Medical Report",
            component: (
              <PatientMedicalDetails
                patientId={patientId}
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
              />
            ),
            icon: <MdLocalHospital style={{ fontSize: "25px" }} />,
            size: 6,
            editURL: null,
            prop: "tbdetails",
          },
          {
            title: "Contact Screening",
            component: (
              <PatientContactScreeningDetails
                patientId={patientId}
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
              />
            ),
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: null,
            prop: "contactscreening",
          },
          {
            title: "Medicines",
            component: (
              <PatientMedicineDetails
                patientId={patientId}
                refreshKey={refreshKey}
              />
            ),
            icon: <MdVaccines style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
          },
          {
            title: "Follow Up",
            component: (
              <PatientFollowUpDetails
                patientId={patientId}
                refreshKey={refreshKey}
              />
            ),
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
                {isAdmin && (
                  <RiPencilLine
                    style={{ fontSize: "20px" }}
                    onClick={() => handleEditClick(section)}
                  />
                )}
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
