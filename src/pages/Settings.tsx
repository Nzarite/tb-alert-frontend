import { Box, List, ListSubheader, Typography } from "@mui/material";
import SettingItem from "../components/Settings/SettingItem";
import { useSettings } from "../hooks/useSettings";
import { groupSettingsByType } from "../utils/utils";

const Settings = () => {
  const { settings, updateSetting } = useSettings();
  const groupedSettings = groupSettingsByType(settings);

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
              <SettingItem
                key={keyName}
                keyName={keyName}
                value={value}
                type={type}
                updateSetting={updateSetting}
              />
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
