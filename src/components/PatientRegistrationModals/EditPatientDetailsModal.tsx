import {
  Alert,
  Box,

  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
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
    useSelector((state) => state.user?.profile?.email) ||
    auth.user?.profile?.email;

  const [originalData, setOriginalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchFormData();
    }
  }, [open, prop]);

  const fetchFormData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/${prop}/${patientId}`);
      setFormData((prevData) => ({
        ...prevData,
        [`${prop}Details`]: response.data,
      }));
      setOriginalData(response.data);
    } catch (error: any) {
      console.error("Error fetching form data:", error);
      setError(
        error.response?.data || "Failed to fetch form data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPostUrl = (prop: string) => {
    switch (prop) {
      case "tbdetails":
        return `/tbdetails/register`;
      case "nikshaymitra":
        return `/nikshaymitra/register`;
      case "contactscreening":
        return `/contactscreening`;
      default:
        return "";
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
    setUpdating(true);
    setError(null);

    setFormData((prevData) => ({
      ...prevData,
      [`${prop}Details`]: updatedData,
      updatedBy: userEmail,
    }));

    const updateurl = getUpdateUrl(prop, patientId);
    const posturl = prop === "patient" ? "" : getPostUrl(prop);
    if (!updateurl || (prop !== "patient" && !posturl)) {
      console.error("Invalid API URL");
      setError("Invalid API URL");
      setUpdating(false);
      return;
    }

    try {
      let response;
      if (!originalData) {
        response = await axiosInstance.post(posturl, {
          ...updatedData,
          patientId,
        });
        console.log("Data created successfully!", response.data);
      } else if (JSON.stringify(updatedData) !== JSON.stringify(originalData)) {
        response = await axiosInstance.put(updateurl, updatedData);
        console.log("Data updated successfully!", response.data);
      } else {
        console.log("No changes detected. Skipping update.");
      }
      onClose();
    } catch (error: any) {
      console.error("Error saving data:", error);
      setError(
        error.response?.data || "Failed to save data. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  const language = useSelector((state: any) => state.language.language);

  const renderForm = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      );
    }
    switch (prop) {
      case "patient":
        return (
          <PatientDetailsForm
            language={language}
            data={formData.patientDetails}
            onSave={handleUpdate}
            onClose={onClose}
            functionality="editdetails"
            loading={updating}
          />
        );
      case "tbdetails":
        return (
          <TbDetailsForm
            language={language}
            data={formData.tbdetailsDetails}
            onSave={handleUpdate}
            onClose={onClose}
            functionality="editdetails"
            loading={updating}
          />
        );
      case "nikshaymitra":
        return (
          <NikshayDetailsForm
            language={language}
            data={formData.nikshaymitraDetails}
            onSave={handleUpdate}
            onClose={onClose}
            functionality="editdetails"
            loading={updating}
          />
        );
      case "contactscreening":
        return (
          <ContactScreeningDetailsForm
            language={language}
            data={formData.contactscreeningDetails}
            onSave={handleUpdate}
            onClose={onClose}
            functionality="editdetails"
            loading={updating}
          />
        );
      default:
        return null;
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
          {error && (
            <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditPatientDetailsModal;
