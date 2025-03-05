import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormReset,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { SettingsInterface } from "../../components/datatypes/DataTypes";
import RenderSettingItem from "./RenderSettingItem";
import { fetchStates, postSetting, updateSetting } from "./settingsService";

interface Props {
  setting: SettingsInterface;
  control: Control<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  reset: UseFormReset<any>;
  loadSettings: () => void;
}

const SettingField = ({
  setting,
  control,
  errors,
  setValue,
  reset,
  loadSettings,
}: Props) => {
  const fieldValue = useWatch({ control, name: setting.keyName });
  const [editable, setEditable] = useState(false);
  const [stateList, setStateList] = useState([]);

  // Load active states
  useEffect(() => {
    const loadState = async () => {
      try {
        if (setting.keyName === "state") {
          const states = await fetchStates();
          setStateList(states.map((state) => state.stateName));
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    loadState();
  }, [loadSettings, setting.keyName]);

  const handleFieldSubmit = async () => {
    try {
      setting.keyName === "state"
        ? await postSetting({ fieldValue }, setting.endpoint)
        : await updateSetting(setting.keyName, fieldValue);
      setEditable(false);
      await loadSettings();
    } catch (error) {
      console.error("Error saving setting:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography sx={{ width: 200, fontWeight: 500, color: "gray" }}>
          {setting.label}
        </Typography>
        <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
          {setting.type === "button" ? (
            <Button
              variant="contained"
              onClick={() => window.open(setting.value)}
            >
              {setting.placeholder}
            </Button>
          ) : (
            <>
              <Controller
                name={setting.keyName}
                control={control}
                render={({ field }) => (
                  <RenderSettingItem
                    field={field}
                    setting={setting}
                    options={
                      setting.endpoint ? setting.value.split(",") : undefined
                    }
                    errors={errors}
                    editable={editable}
                    setValue={setValue}
                    loadSettings={loadSettings}
                  />
                )}
              />
              {editable ? (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      reset();
                      setEditable(false);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleFieldSubmit}
                    disabled={!!errors[setting.keyName]}
                  >
                    Save
                  </Button>
                </Box>
              ) : (
                <IconButton
                  size="small"
                  sx={{ alignSelf: "flex-start" }}
                  onClick={() => setEditable(true)}
                >
                  <MdEdit />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
      {setting.keyName === "state" && (
        <Box
          sx={{
            display: "flex",
            // border: "1px solid blue",
            alignItems: "center",
            width: "84%",
          }}
        >
          <Typography sx={{ width: 200, fontWeight: 500, color: "gray" }}>
            Active Regions
          </Typography>
          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
            {stateList.map((state) => (
              <Button
                key={state}
                variant="contained"
                size="small"
                disabled
                sx={{ borderRadius: 5 }}
              >
                {state}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SettingField;
