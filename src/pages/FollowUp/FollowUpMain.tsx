import { zodResolver } from "@hookform/resolvers/zod";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Rating,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiPencilFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  MedicationInterface,
  VisitDataInterface,
} from "../../components/datatypes/DataTypes";
import axiosInstance from "../../components/axiosInstance";
import EditPatientDetailsModal from "../../components/PatientRegistrationModals/EditPatientDetailsModal";
import { useSelector } from "react-redux";

interface Props {
  index: number;
  data: VisitDataInterface | null;
  getPatientData: (input: string) => void;
}

// export const patientConditionLabels: { [key: number]: string } = {
//   1: "Need Urgent Support",
//   2: "Poor",
//   3: "Ok",
//   4: "Improving",
//   5: "Excellent",
// };

const schema = z.object({
  remarks: z.string().min(1, "Description can't be null"),
  currentStatus: z.boolean(),
  missedMedications: z.array(
    z.object({
      medicationId: z.number(),
      missedDosages: z
        .string()
        .min(1, "Please enter a number")
        .regex(/^\d+$/, { message: "Input must be a valid number" })
        .transform(Number)
        .refine((val) => val >= 0, {
          message: "Missed doses cannot be negative",
        }),
      comments: z.string().optional(),
    })
  ),
  cured: z.boolean(),
  patientCondition: z.number(),
});

type FormData = z.infer<typeof schema>;

const FollowUpFormComponent = ({ index, data, getPatientData }: Props) => {
  // This state toggles if the current followup can be edited or not
  const [isEditable, setIsEditable] = useState(false);
  const [hover, setHover] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [labels, setLabels] = useState<any>(null);
  const language = useSelector((state: any) => state.language.language);
  const [patientConditionLabels, setPatientConditionLabels] = useState<{ [key: number]: string }>({});

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      currentStatus: data?.patient.currentStatus === "alive",
      patientCondition: data?.followUpDetails[index]?.patientCondition ?? 4,
      remarks: data?.followUpDetails[index]?.remarks ?? "",
      cured: data?.patient.cured ?? false,
      missedMedications:
        data?.followUpDetails[index]?.medicationDetails?.map((med) => ({
          medicationId: med.medicationId,
          missedDosages: med.missedDosages?.toString() ?? "",
          comments: med.comments ?? "",
        })) || [],
    },
  });

  // Reset form values when the selected follow-up (index or data) changes.
  useEffect(() => {
    if (data) {
      reset({
        currentStatus: data?.patient.currentStatus === "alive",
        patientCondition: data?.followUpDetails[index]?.patientCondition ?? 4,
        remarks: data?.followUpDetails[index]?.remarks ?? "",
        cured: data?.patient.cured ?? false,
        missedMedications:
          data?.followUpDetails[index]?.medicationDetails?.map((med) => ({
            medicationId: med.medicationId,
            missedDosages: med.missedDosages?.toString() ?? "",
            comments: med.comments ?? "",
          })) || [],
      });
    }
  }, [index, data, reset, isEditable]);

  useEffect(() => {
    fetch(`/locales/followup_page_${language}.json`)
      .then((response) => response.json())
      .then((data) => {
        setLabels(data.followuppage)
        setPatientConditionLabels(data.followuppage.patientConditionLabels)
      })
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  // Helper function for rating labels
  function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${
      patientConditionLabels[value]
    }`;
  }

  const handleModalClose = async () => {
    setModalOpen(false);
    if (data?.patient.patientId) {
      await getPatientData(data.patient.patientId.toString());
    }
  };

  const formSubmitHandler = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const submitData = {
        ...formData,
        date: data?.followUpDetails[index].date,
        currentStatus: formData.currentStatus ? "alive" : "dead",
      };
      await axiosInstance.put(
        `/followup/${data?.patient.patientId}`,
        submitData
      );
      await getPatientData(data?.patient.patientId?.toString());
    } catch (error: any) {
      console.error(Error);
      setError(
        error.response?.data || "Failed to update follow-up. Please try again."
      );
    } finally {
      setLoading(false);
      setIsEditable(false);
    }
  };

  // MedicationRow component uses Controller for each dynamic field.
  const MedicationRow = ({
    medicine,
    medIndex,
  }: {
    medicine: MedicationInterface;
    medIndex: number;
  }) => (
    <TableRow key={medicine.medicationId}>
      <TableCell>
        <Typography>{medicine.medicationName}</Typography>
      </TableCell>
      <TableCell>
        <Controller
          name={`missedMedications.${medIndex}.missedDosages`}
          control={control}
          disabled={!isEditable}
          defaultValue={medicine.missedDosages || 0}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              error={!!errors.missedMedications?.[medIndex]?.missedDosages}
              helperText={
                errors.missedMedications?.[medIndex]?.missedDosages?.message
              }
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          name={`missedMedications.${medIndex}.comments`}
          control={control}
          defaultValue={medicine.comments || ""}
          disabled={!isEditable}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              error={!!errors.missedMedications?.[medIndex]?.comments}
              helperText={
                errors.missedMedications?.[medIndex]?.comments?.message
              }
            />
          )}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        height: "72vh",
        overflow: "auto",
        padding: 4,
        marginTop: 1,
      }}
    >
      {data && data.followUpDetails.length > 0 ? (
        <>
          <Typography
            variant="h6"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {labels?.followUp} {index + 1}{" "}
            <RiPencilFill onClick={() => setIsEditable(!isEditable)} />
          </Typography>
          <Typography variant="subtitle1" mb={2}>
            {data.followUpDetails[index].date}
          </Typography>
          <Divider variant="fullWidth" sx={{ mb: 2 }} />
          <Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
            <Stack spacing={4}>
              <Controller
                name="currentStatus"
                control={control}
                disabled={!isEditable}
                render={({ field }) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "210px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {labels?.isPatientAlive}
                    </Typography>
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </div>
                )}
              />

              {/* Cured Status Switch */}
              <Controller
                name="cured"
                control={control}
                disabled={!isEditable}
                render={({ field }) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "210px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {labels?.isPatientCured}
                    </Typography>
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </div>
                )}
              />

              {/* Patient Condition (Rating) */}
              <Controller
                name="patientCondition"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "50px",
                    }}
                  >
                    <Typography>{labels?.patientCondition}</Typography>
                    <Box display={"flex"}>
                      <Rating
                        name="patientCondition"
                        value={value}
                        getLabelText={getLabelText}
                        onChange={(_, newValue) => onChange(newValue)}
                        onChangeActive={(_, newHover) => setHover(newHover)}
                        disabled={!isEditable}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                      />
                      {value !== null && (
                        <Box sx={{ marginLeft: 3 }}>
                          {patientConditionLabels[hover !== -1 ? hover : value]}
                        </Box>
                      )}
                    </Box>
                  </div>
                )}
              />

              {/* Patient Condition Description */}
              <TextField
                id="recoveryStatus-desc"
                label={labels?.recoveryStatus}
                placeholder={labels?.enterConditionDetail}
                multiline
                rows={3}
                error={!!errors.remarks}
                helperText={errors.remarks?.message}
                disabled={!isEditable}
                {...register("remarks")}
                InputLabelProps={{
                  shrink:
                    watch("remarks") !== undefined &&
                    watch("remarks").length > 0,
                }}
              />

              {/* Medications Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{labels?.medicationName}</TableCell>
                      <TableCell>{labels?.missedDoses}</TableCell>
                      <TableCell>{labels?.comments}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.followUpDetails[index].medicationDetails.length >
                    0 ? (
                      data.followUpDetails[index].medicationDetails.map(
                        (medicine, medIndex) => (
                          <MedicationRow
                            key={medicine.medicationId}
                            medicine={medicine}
                            medIndex={medIndex}
                          />
                        )
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="body2" color="textSecondary">
                            {labels?.noMedicationsFound}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Buttons */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => reset()}
                  disabled={!isEditable}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isValid || !isEditable || loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </Button>
                {error && (
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Typography align="center" variant="body1" color="textSecondary">
            {labels?.pleaseCompleteTbDetailsRegistration}
          </Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            {labels?.registerTbDetails}
          </Button>
          {modalOpen && (
            <EditPatientDetailsModal
              open={modalOpen}
              onClose={handleModalClose}
              prop="tbdetails"
              patientId={data?.patient.patientId}
            />
          )}
        </div>
      )}
    </Paper>
  );
};

export default FollowUpFormComponent;
