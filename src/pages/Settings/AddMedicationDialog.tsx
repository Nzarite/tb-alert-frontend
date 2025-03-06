import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { ControllerRenderProps } from "react-hook-form";
import { SettingsInterface } from "../../components/datatypes/DataTypes";
import { postSetting } from "./settingsService";

interface Props {
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  newMedication: string;
  options: string[];
  setOptions: (options: string[]) => void;
  setValue: (key: string, value: string[]) => void;
  setting: SettingsInterface;
  field: ControllerRenderProps<any, string>;
  loadSettings: () => void;
}

const AddMedicationDialog = ({
  confirmOpen,
  setConfirmOpen,
  newMedication,
  options,
  setOptions,
  setValue,
  setting,
  field,
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
              setOptions([...options, newMedication]); // Update dropdown
              setValue(setting.keyName, [...field.value, newMedication]); // Add to selection
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
