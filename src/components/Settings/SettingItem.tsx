import SaveIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItem, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toSnakeCase } from "../../utils/utils";

type SettingItemProps = {
  keyName: string;
  value: string;
  type: string;
  updateSetting: (keyName: string, newValue: string, type: string) => void;
};

export const SettingItem = ({
  keyName,
  value,
  type,
  updateSetting,
}: SettingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    updateSetting(toSnakeCase(keyName), editValue, type);
    setIsEditing(false);
  };

  return (
    <ListItem>
      <Typography sx={{ fontSize: "medium" }}>{keyName}: </Typography>
      {isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          autoFocus
        />
      ) : (
        <Typography sx={{ fontSize: "medium" }}>{value} </Typography>
      )}

      {isEditing ? (
        <>
          <IconButton onClick={handleSave} color="primary">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={() => setIsEditing(false)} color="error">
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={() => setIsEditing(true)} color="primary">
          <EditIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

export default SettingItem;
