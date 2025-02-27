import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import axiosInstance from "../../components/axiosInstance";

const smsTemplateVariables = [
  { label: "Patient ID", value: "{patientId}" },
  { label: "Nikshay ID", value: "{nikshayId}" },
  { label: "Patient Name", value: "{firstName} {lastName}" },
  { label: "Medication Date", value: "{medication_date}" },
  { label: "Medication List", value: "{medication_names}" },
  { label: "Contact Info", value: "{org_phone_number}" },
];

const SettingField = ({ setting, control, errors, setValue }) => {
  const fieldValue = useWatch({ control, name: setting.keyName });
  const [edited, setEdited] = useState(false);
  const textAreaRef = useRef(null);

  const insertTextAtCursor = (textToInsert: string, field) => {
    if (!textAreaRef.current) return;

    const input = textAreaRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newValue =
      field.value.substring(0, start) +
      textToInsert +
      field.value.substring(end);

    setValue(setting.keyName, newValue);
  };

  const handleFieldSubmit = async () => {
    const formData = {
      keyName: setting.keyName,
      value: control._formValues[setting.keyName] ?? "",
    };
    try {
      await axiosInstance.post("/setting", formData);
    } catch (error) {
      console.error("Error saving setting:", error);
    }
  };

  useEffect(() => {
    setEdited(fieldValue !== setting.value);
  }, [fieldValue]);

  const renderField = ({ field }) => {
    const availableSnippets = smsTemplateVariables.filter(
      (snippet) => !field.value?.includes(snippet.value)
    );

    switch (setting.type) {
      case "text":
      case "number":
        return (
          <TextField
            {...field}
            size="small"
            sx={{ width: "80%" }}
            variant="outlined"
            error={!!errors[setting.keyName]}
            helperText={errors[setting.keyName]?.message || setting.placeholder}
          />
        );
      case "longtext":
        return (
          <Box sx={{ width: "80%" }}>
            <TextField
              {...field}
              multiline
              rows={5}
              size="small"
              fullWidth
              variant="outlined"
              error={!!errors[setting.keyName]}
              inputRef={textAreaRef}
              helperText={
                errors[setting.keyName]?.message || setting.placeholder
              }
            />
            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", mt: 1 }}>
              {availableSnippets.map((text) => (
                <Box
                  key={text.value}
                  onClick={() => insertTextAtCursor(text.value, field)}
                  sx={{
                    bgcolor: "#0B455C",
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                    p: "6px 12px",
                    borderRadius: 2,
                    textAlign: "center",
                    boxShadow: "1px 1px 5px rgba(0,0,0,0.2)",
                    "&:hover": { bgcolor: "#0A3A4F" },
                  }}
                >
                  {text.label}
                </Box>
              ))}
            </Box>
          </Box>
        );
      case "time":
        return (
          <TextField
            {...field}
            type="time"
            sx={{ width: "80%" }}
            size="small"
            variant="outlined"
            error={!!errors[setting.keyName]}
            helperText={errors[setting.keyName]?.message || setting.placeholder}
          />
        );
      case "chips":
        return (
          <Autocomplete
            multiple
            options={setting.value}
            value={Array.isArray(field.value) ? field.value : []}
            onChange={(_, newValue) => setValue(setting.keyName, newValue)}
            size="small"
            sx={{ width: "80%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={!!errors[setting.keyName]}
                helperText={
                  errors[setting.keyName]?.message || setting.placeholder
                }
              />
            )}
          />
        );
      case "multi-input":
        return <></>;
    }
  };

  return (
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
              render={({ field }) => renderField({ field })}
            />
            {setting.type !== "button" && edited && (
              <Box sx={{ alignSelf: "flex-start", display: "flex" }}>
                <Button
                  variant="text"
                  size="small"
                  sx={{ minWidth: "70px" }}
                  onClick={() => setValue(setting.keyName, setting.value)}
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
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SettingField;
