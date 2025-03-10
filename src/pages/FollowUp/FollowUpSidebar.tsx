import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { VisitDataInterface } from "../../components/datatypes/DataTypes";
import FollowUpStatus from "../../components/Json/FollowUpStatus.json";
import AddFollowupDialog from "./AddFollowupDialog";
import { useSelector } from "react-redux";

interface FollowUpSidebarProps {
  selectedIndex: number;
  setIndex: (index: number) => void;
  data: VisitDataInterface;
  getPatientData: (input: string) => void;
}

export const getStatusColor = (
  dateOfFollowUp: string,
  followUpStatus: string
) => {
  if (followUpStatus === FollowUpStatus.Cancelled) return "primary";

  const today = new Date();
  const dof = new Date(dateOfFollowUp);

  // Normalize both dates to midnight for accurate date-only comparison
  today.setHours(0, 0, 0, 0);
  dof.setHours(0, 0, 0, 0);

  if (dof.getTime() > today.getTime()) return "warning";
  if (dof.getTime() === today.getTime())
    return followUpStatus === FollowUpStatus.Missed ? "warning" : "success";
  return followUpStatus === FollowUpStatus.Missed ? "error" : "success";
};

export const getStatusName = (
  dateOfFollowUp: string,
  followUpStatus: string
) => {
  if (followUpStatus === FollowUpStatus.Cancelled)
    return FollowUpStatus.Cancelled;

  const today = new Date();
  const dof = new Date(dateOfFollowUp);

  // Normalize both dates to midnight
  today.setHours(0, 0, 0, 0);
  dof.setHours(0, 0, 0, 0);

  if (dof.getTime() > today.getTime()) return FollowUpStatus.Scheduled;
  if (dof.getTime() === today.getTime()) {
    return followUpStatus === FollowUpStatus.Missed
      ? FollowUpStatus.Scheduled
      : FollowUpStatus.Captured;
  }
  return followUpStatus === FollowUpStatus.Missed
    ? FollowUpStatus.Missed
    : FollowUpStatus.Captured;
};

export default function FollowUpSidebar({
  selectedIndex,
  setIndex,
  data,
  getPatientData,
}: FollowUpSidebarProps) {
  // State for toggling add followup dialog
  const [open, setOpen] = useState(false);
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

  // Enables/disables list button based on followup status and date
  const isEditable = (followUpStatus: string, dateOfFollowUp: string) => {
    if (followUpStatus === FollowUpStatus.Cancelled) return false;

    const today = Date.now();
    const dof = Date.parse(dateOfFollowUp);

    return today > dof;
  };

  return (
    <Box>
      <Box sx={{ px: 1, mb: 2 }}>
        <Typography
          variant="subtitle2"
          mb={2}
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {labels?.patientOverview}
        </Typography>
        <Box>
          <Stack spacing={1} sx={{ px: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                {labels?.name}:{" "}
              </Typography>
              {data.patient.firstName} {data.patient.lastName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                {labels?.gender}:{" "}
              </Typography>
              {data.patient.gender}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                {labels?.age}:{" "}
              </Typography>
              {data.patient.age}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                {labels?.phone}:{" "}
              </Typography>
              {data.patient.phoneNumber}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          padding: 2,
          height: "56.3vh",
          overflow: "auto",
        }}
      >
        {data.followUpDetails.length > 0 ? (
          <>
            <Typography
              variant="subtitle2"
              sx={{
                px: 1,
                py: 1,
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              {labels?.followUpVisits}
            </Typography>

            <List disablePadding>
              {data.followUpDetails.map((item, index) => (
                <ListItemButton
                  key={index}
                  selected={selectedIndex === index}
                  onClick={() => setIndex(index)}
                  disabled={!isEditable(item.followUpStatus, item.date)}
                  disableRipple
                  sx={{
                    borderRadius: 3,
                    mb: 0.5,
                    py: 1.2,
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {labels?.followUp} #{index + 1}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {item.date}
                      </Typography>
                    }
                    sx={{ my: 0 }}
                  />
                  <Chip
                    label={getStatusName(item.date, item.followUpStatus)}
                    color={getStatusColor(item.date, item.followUpStatus)}
                    variant="filled"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.65rem",
                      height: 20,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>

            {selectedIndex === data.followUpDetails.length - 1 && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setOpen(true)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    mt: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <FaPlusCircle size={10} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {labels?.addFollowUp}
                  </Typography>
                </Button>
                <AddFollowupDialog
                  open={open}
                  handleClose={() => setOpen(false)}
                  getPatientData={getPatientData}
                  data={data}
                />
              </>
            )}
          </>
        ) : (
          <Typography align="center" variant="body2" color="textSecondary">
            {labels?.noFollowUps}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
