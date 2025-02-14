import { Box, List, ListItem, ListSubheader, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { settingType } from "../redux/settingsSlice";
import { RootState } from "../redux/store";

const Settings = () => {
  const state = useSelector((state: RootState) => state);
  const settings = state.settings.settings;

  const groupedSettings = settings.reduce((acc, setting) => {
    const category =
      setting.type.charAt(0).toUpperCase() + setting.type.slice(1);
    acc[category] = acc[category] || [];
    const modifiedSetting: settingType = {
      ...setting,
      key: setting.key
        .replace(/(^|_)(\w)/g, (_, __, letter) => " " + letter.toUpperCase())
        .trim(),
      type: category,
    };
    acc[category].push(modifiedSetting);
    return acc;
  }, {} as Record<string, typeof settings>);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
            {items.map((item) => (
              <ListItem key={item.key}>
                <Typography sx={{ fontSize: "medium" }}>
                  {item.key}: {item.value}
                </Typography>
              </ListItem>
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
