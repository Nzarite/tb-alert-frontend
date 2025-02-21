import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { VisitDataInterface } from "../../components/datatypes/DataTypes";
import FollowUpStatus from "../../components/Json/FollowUpStatus.json";

interface FollowUpSidebarProps {
  selectedIndex: number;
  setIndex: (index: number) => void;
  data: VisitDataInterface;
}

export const getStatusColor = (
  dateOfFollowUp: string,
  followUpStatus: string
) => {
  if (followUpStatus === FollowUpStatus.Cancelled) return "primary";

  const today = Date.now();
  const dof = Date.parse(dateOfFollowUp);

  if (today < dof) return "warning";
  return followUpStatus === FollowUpStatus.Missed ? "error" : "success";
};

export const getStatusName = (
  dateOfFollowUp: string,
  followUpStatus: string
) => {
  if (followUpStatus === FollowUpStatus.Cancelled)
    return FollowUpStatus.Cancelled;

  const today = Date.now();
  const dof = Date.parse(dateOfFollowUp);

  if (today < dof) return FollowUpStatus.Scheduled;
  return followUpStatus === FollowUpStatus.Missed
    ? FollowUpStatus.Missed
    : FollowUpStatus.Captured;
};

export default function FollowUpSidebar({
  selectedIndex,
  setIndex,
  data,
}: FollowUpSidebarProps) {
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
          Patient Overview
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
                Name:{" "}
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
                Gender:{" "}
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
                Age:{" "}
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
                Phone:{" "}
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
              Follow-up Visits
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
                        Follow Up #{index + 1}
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
          </>
        ) : (
          <Typography align="center" variant="body2" color="textSecondary">
            No Follow ups found
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
