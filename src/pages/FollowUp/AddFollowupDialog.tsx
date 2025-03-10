import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VisitDataInterface } from "../../components/datatypes/DataTypes";
import axiosInstance from "../../components/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface DialogProps {
  open: boolean;
  handleClose: () => void;
  data: VisitDataInterface;
  getPatientData: (input: string) => void;
}

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split("T")[0];

const schema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => date >= getTodayDate(), {
      message: "Follow-up date must be in the future",
    }),
});

type FormData = z.infer<typeof schema>;

const AddFollowupDialog = ({
  open,
  handleClose,
  data,
  getPatientData,
}: DialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });

  const [labels, setLabels] = useState<any>(null);
  const language = useSelector((state: any) => state.language.language);

  useEffect(() => {
    fetch(`/locales/followup_page_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.followuppage))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  // Resets the form when the dialog opens
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const submitHandler = async (formData: FormData) => {
    try {
      const submitData = { ...formData, patientCondition: 0 };
      await axiosInstance.post(
        `/followup/${data.patient.patientId}`,
        submitData
      );
      await getPatientData(data.patient.patientId);
    } catch (error) {
      console.error("Error submitting follow-up:", error);
    } finally {
      reset();
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{labels?.addFollowUp}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {labels?.pleaseEnterDateOfNextFollowUp}
        </DialogContentText>
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextField
            autoFocus
            required
            id="date"
            label="Date of Followup"
            type="date"
            fullWidth
            variant="standard"
            sx={{ mt: 4 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getTodayDate() }}
            error={!!errors.date}
            helperText={errors.date?.message}
            {...register("date")}
          />
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!isValid}>
              Add
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFollowupDialog;
