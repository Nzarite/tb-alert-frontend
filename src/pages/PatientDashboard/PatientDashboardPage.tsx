import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const roles: string[] = useAuth().user?.profile.client_roles as string[];
  const isAdmin = roles.includes("SuperAdmin");
  const canDiagnose = roles.includes("GpHead");
  const [diagnosedWithTB, setDiagnosedWithTB] = useState<boolean>(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserDiagnosis = async () => {
      try {
        const response = await axiosInstance.get(`/patient/${patientId}`);
        setDiagnosedWithTB(response.data.isDiagnosedWithTB);
        setSelectedPatientData("nikshaymitra");
        setModalOpen(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserDiagnosis();
  }, [patientId]);

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
    setRefreshData((prev) => !prev);
  };

  const handleConfirmDialogClose = async (confirm: boolean) => {
    setConfirmDialogOpen(false);
    if (confirm) {
      try {
        const diagnosedWithTB = {
          isDiagnosedWithTB: true,
        };
        const response = await axiosInstance.put(
          `/patient/update/${patientId}`,
          diagnosedWithTB
        );
        setDiagnosedWithTB(true);
      } catch (error) {console.log(error);}
    }
  };

  if (!patientId) {
    return <Typography variant="h6">No patient selected</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        {!diagnosedWithTB && canDiagnose && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1">Mark as Diagnosed with TB</Typography>
            <Switch
              checked={diagnosedWithTB}
              onChange={() => setConfirmDialogOpen(true)}
              color="primary"
            />
          </Box>
        )}
        {isAdmin && (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="error"
              variant="contained"
              size="large"
              onClick={() => setDeleteModalOpen(true)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Box>

      <DeletePersonModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        deleteUrl={`patient/${patientId}`}
        navigateUrl="/patient-dashboard"
        person={"Patient"}
      />

      <Grid container spacing={2} sx={{ p: 2 }}>
        {[
          {
            title: "Personal Details",
            component: (
              <PatientPersonalDetails
                patientId={patientId}
                refresh={refreshData}
              />
            ),
            icon: <MdPerson style={{ fontSize: "24px" }} />,
            size: 6,
            editURL: null,
            prop: "patient",
            hidden: true,
          },
          {
            title: "Nikshay Details",
            component: (
              <PatientNikshayDetails
                patientId={patientId}
                refresh={refreshData}
              />
            ),
            icon: <MdMobileFriendly style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
            prop: "nikshaymitra",
            hidden: diagnosedWithTB,
          },
          {
            title: "Medical Report",
            component: (
              <PatientMedicalDetails
                patientId={patientId}
                refresh={refreshData}
              />
            ),
            icon: <MdLocalHospital style={{ fontSize: "25px" }} />,
            size: 6,
            editURL: null,
            prop: "tbdetails",
            hidden: diagnosedWithTB,
          },
          {
            title: "Contact Screening",
            component: (
              <PatientContactScreeningDetails
                patientId={patientId}
                refresh={refreshData}
              />
            ),
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: null,
            prop: "contactscreening",
            hidden: diagnosedWithTB,
          },
          {
            title: "Medicines",
            component: <PatientMedicineDetails patientId={patientId} />,
            icon: <MdVaccines style={{ fontSize: "20px" }} />,
            size: 6,
            editURL: null,
            hidden: diagnosedWithTB,
          },
          {
            title: "Follow Up",
            component: <PatientFollowUpDetails patientId={patientId} />,
            icon: <MdAssessment style={{ fontSize: "22px" }} />,
            size: 6,
            editURL: "/visit",
            prop: patientId,
            hidden: diagnosedWithTB,
          },
        ].map(
          (section, index) =>
            section.hidden && (
              <Grid item xs={12} sm={section.size} key={index}>
                <Paper sx={{ p: 3, height: "100%", overflowY: "auto" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                    {isAdmin && section.title !== "Medicines" && (
                      <IconButton>
                        <RiPencilLine
                          color="black"
                          cursor="pointer"
                          style={{
                            fontSize: "20px",
                            transition: "transform 0.2s, color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          onClick={() => handleEditClick(section)}
                        />
                      </IconButton>
                    )}
                  </Box>
                  {section.component}
                </Paper>
              </Grid>
            )
        )}
      </Grid>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => handleConfirmDialogClose(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this patient as diagnosed with TB?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmDialogClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmDialogClose(true)}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

  <EditPatientDetailsModal
        open={modalOpen}
        onClose={handleModalClose}
        prop={selectedPatientData}
        patientId={patientId}
      />
    </>
  );
};

export default PatientDashboardPage;
