import SaveIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../components/axiosInstance";
import {
  setSettings,
  settingType,
  updateSettings,
} from "../redux/settingsSlice";
import { RootState } from "../redux/store";

const Settings = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const settings = state.admin.settings;

  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/setting/all")
      .then((response) => {
        dispatch(setSettings(response.data));
      })
      .catch((error) => console.log(error.message));
  }, []);

  const toSnakeCase = (str: string): string => {
    return str
      .replace(/\s+/g, "_")
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase();
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    const category =
      setting.type.charAt(0).toUpperCase() + setting.type.slice(1);
    acc[category] = acc[category] || [];
    const modifiedSetting: settingType = {
      ...setting,
      keyName: setting.keyName
        .replace(/(^|_)(\w)/g, (_, __, letter) => " " + letter.toUpperCase())
        .trim(),
      type: category,
    };
    acc[category].push(modifiedSetting);
    return acc;
  }, {} as Record<string, typeof settings>);

  const handleEditClick = (keyName: string, value: string) => {
    setEditKey(keyName);
    setEditValue(value);
  };

  const handleSaveClick = (keyName: string, newValue: string, type: string) => {
    keyName = toSnakeCase(keyName);
    const requestBody = { keyName, value: newValue, type };
    axiosInstance
      .put("/setting", requestBody)
      .then(() => {
        dispatch(updateSettings({ keyName, newValue }));
        setEditKey(null);
      })
      .catch((error) => console.log(error.message));
  };

  const handleCancelClick = () => {
    setEditKey(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 3,
        width: "80vw",
        margin: "0 auto",
        mt: 10,
      }}
    >
      <Typography variant="h3">Settings</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {Object.entries(groupedSettings).map(([type, items]) => (
          <List
            key={type}
            subheader={
              <ListSubheader sx={{ fontSize: "x-large", background: "none" }}>
                {type}
              </ListSubheader>
            }
          >
            {items.map(({ keyName, value }) => (
              <ListItem key={keyName}>
                <Typography sx={{ fontSize: "medium" }}>{keyName}: </Typography>
                {editKey === keyName ? (
                  <>
                    <TextField
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    ></TextField>
                  </>
                ) : (
                  <Typography sx={{ fontSize: "medium" }}>{value} </Typography>
                )}

                {editKey === keyName ? (
                  <>
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
                  <IconButton
                    onClick={() => handleEditClick(keyName, value)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
