import { Box, List, ListSubheader, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { SettingType } from "../components/datatypes/DataTypes";
import SettingListItem from "../components/Settings/SettingListItem";
import SettingStringItem from "../components/Settings/SettingStringItem";
import { groupSettingsByType } from "../utils/utils";

const Settings = () => {
  const [settings, setSettings] = useState<SettingType[]>([]);
  const getSettings = () => {
    axiosInstance
      .get("/setting/all")
      .then((response) => setSettings(response.data))
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    getSettings();
  }, []);
  const groupedSettings = groupSettingsByType(settings);

  const listSettings = ["MEDICATION"];

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
            {items.map(({ keyName, value, type }) =>
              listSettings.includes(type) ? (
                <SettingListItem
                  key={keyName}
                  keyName={keyName}
                  value={value}
                  type={type}
                  settings={settings}
                  getSettings={getSettings}
                  setSettings={setSettings}
                />
              ) : (
                <SettingStringItem
                  key={keyName}
                  keyName={keyName}
                  value={value}
                  type={type}
                  settings={settings}
                  getSettings={getSettings}
                  setSettings={setSettings}
                />
              )
            )}
          </List>
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
