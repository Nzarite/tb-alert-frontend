import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { SettingsInterface } from "../../components/datatypes/DataTypes";
import { postSetting } from "./settingsService";

interface Props {
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  newMedication: string;
  setting: SettingsInterface;
  loadSettings: () => void;
}

const AddMedicationDialog = ({
  confirmOpen,
  setConfirmOpen,
  newMedication,
  setting,
  loadSettings,
}: Props) => {
  return (
    <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
      <DialogTitle>Confirm New Medication</DialogTitle>
      <DialogContent>
        <Typography>
          Do you want to add "{newMedication}" to the medications list?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              await postSetting({ name: newMedication }, setting.endpoint);
              await loadSettings();
            } catch (error) {
              console.error("Failed to add medication:", error);
            }
            setConfirmOpen(false);
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMedicationDialog;
