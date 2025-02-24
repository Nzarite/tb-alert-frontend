import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useSelector } from "react-redux";
import axiosInstance from "../axiosInstance";
import ContactScreeningDetailsForm, {
  ContactScreeningData,
} from "../ContactScreeningDetailsForm/ContactScreeningDetailsForm";
import NikshayDetailsForm, {
  NikshayDetailsData,
} from "../NikshayDetailsForm/NikshayDetailsForm";
import PatientDetailsForm, {
  PatientDetailsData,
} from "../PatientDetailsForm/PatientDetailsForm";
import TbDetailsForm, { TbDetailsData } from "../TbDetailsForm/TbDetailsForm";

const EditPatientDetailsModal = ({ open, onClose, prop, patientId }: any) => {
  const [formData, setFormData] = useState({
    patientDetails: {} as PatientDetailsData,
    tbdetailsDetails: {} as TbDetailsData,
    nikshaymitraDetails: {} as NikshayDetailsData,
    contactscreeningDetails: {} as ContactScreeningData,
  });

  const auth = useAuth();
  const userEmail =
    useSelector((state) => state.user.profile.email) ||
    auth.user?.profile.email;

  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetchFormData();
    }
  }, [open, prop]);

  const fetchFormData = async () => {
    try {
      const response = await axiosInstance.get(`/${prop}/${patientId}`);
      setFormData((prevData) => ({
        ...prevData,
        [`${prop}Details`]: response.data,
      }));
      setOriginalData(response.data);
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  const getUpdateUrl = (prop: string, patientId: any) => {
    switch (prop) {
      case "patient":
        return `/patient/update/${patientId}`;
      case "tbdetails":
        return `/tbdetails/${patientId}`;
      case "nikshaymitra":
        return `/nikshaymitra/${patientId}`;
      case "contactscreening":
        return `/contactscreening/${patientId}`;
      default:
        return "";
    }
  };

  const handleUpdate = async (updatedData: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [`${prop}Details`]: updatedData,
      updatedBy: userEmail,
    }));

    // Check if data has changed
    if (JSON.stringify(updatedData) === JSON.stringify(originalData)) {
      onClose(); // Close modal if no changes
      return;
    }

    const url = getUpdateUrl(prop, patientId);
    if (!url) {
      console.error("Invalid update URL");
      return;
    }

    try {
      await axiosInstance.put(url, updatedData);
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const language = useSelector((state: any) => state.language);
  console.log(language);

  const renderForm = () => {
    switch (prop) {
      case "patient":
        return (
          <PatientDetailsForm
            language={language}
            data={formData.patientDetails}
            onSave={handleUpdate}
            functionality="editdetails"
          />
        );
      case "tbdetails":
        return (
          <TbDetailsForm
            language={language}
            data={formData.tbdetailsDetails}
            onSave={handleUpdate}
            functionality="editdetails"
          />
        );
      case "nikshaymitra":
        return (
          <NikshayDetailsForm
            language={language}
            data={formData.nikshaymitraDetails}
            onSave={handleUpdate}
            functionality="editdetails"
          />
        );
      case "contactscreening":
        return (
          <ContactScreeningDetailsForm
            language={language}
            data={formData.contactscreeningDetails}
            onSave={handleUpdate}
            functionality="editdetails"
          />
        );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          {prop === "patient"
            ? "Update Patient Details"
            : prop === "tbdetails"
            ? "Update TB Details"
            : prop === "nikshaymitra"
            ? "Update Nikshay Details"
            : "Update Contact Screening Details"}
        </Typography>
        {renderForm()}
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          {/* <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
          >
            Update
          </Button> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPatientDetailsModal;
