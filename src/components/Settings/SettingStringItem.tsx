import SaveIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItem, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toSnakeCase } from "../../utils/utils";
import axiosInstance from "../axiosInstance";
import { SettingStringItemProps, SettingType } from "../datatypes/DataTypes";

const SettingStringItem = ({
  keyName,
  value,
  type,
  getSettings,
}: SettingStringItemProps) => {
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(value);

  const handleEditClick = (keyName: string, value: string) => {
    setEditKey(keyName);
    setEditValue(value);
  };

  const updateStringSetting = (requestBody: SettingType) => {
    axiosInstance
      .put("/setting", requestBody)
      .then(() => {
        getSettings();
        setEditKey(null);
      })
      .catch((error) => console.log(error.message));
  };

  const handleSaveClick = (keyName: string, newValue: string, type: string) => {
    keyName = toSnakeCase(keyName);
    const requestBody = { keyName, value: newValue, type };

    updateStringSetting(requestBody);
  };

  const handleCancelClick = () => {
    setEditKey(null);
  };

  return (
    <ListItem key={keyName}>
      <Typography sx={{ fontSize: "medium" }}>{keyName}: </Typography>

      {editKey === keyName ? (
        <>
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <IconButton
            onClick={() => handleSaveClick(keyName, editValue, type)}
            color="primary"
          >
            <SaveIcon />
          </IconButton>
          <IconButton onClick={handleCancelClick} color="error">
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: "medium" }}>{value} </Typography>
          <IconButton
            onClick={() => handleEditClick(keyName, value)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default SettingStringItem;
