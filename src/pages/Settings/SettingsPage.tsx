import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axiosInstance from "../../components/axiosInstance";
import categories from "../../components/Json/settings.json";
import SettingField from "./SettingsField";

const createSchema = (categories) => {
  if (!categories) return z.object({});
  const schemaObj = {};

  categories.forEach((category) => {
    category.settings.forEach((setting) => {
      switch (setting.type) {
        case "text":
          schemaObj[setting.keyName] = z
            .string()
            .min(1, "This field is required");
          break;
        case "number":
          schemaObj[setting.keyName] = z
            .number()
            .min(1, "Must be greater than zero")
            .or(z.string().min(1, "This field is required"));
          break;
        case "longtext":
          schemaObj[setting.keyName] = z
            .string()
            .min(1, "This field is required")
            .max(500, "Too long!");
          break;
        case "time":
          schemaObj[setting.keyName] = z
            .string()
            .min(1, "Please select a time");
          break;
        case "chips":
          schemaObj[setting.keyName] = z
            .array(z.string())
            .min(1, "Select at least one item");
          break;
        default:
          break;
      }
    });
  });

  return z.object(schemaObj);
};

const SettingsPage = () => {
  const [data, setData] = useState(categories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // const response = await axiosInstance.get("/setting/all");
        // setData(response.data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const validationSchema = data ? createSchema(data) : null;

  const {
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: data
      ? data.reduce((acc, category) => {
          category.settings.forEach((setting) => {
            acc[setting.keyName] = setting.value || "";
          });
          return acc;
        }, {})
      : {},
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="textSecondary">
          No settings available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", padding: 1 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Settings
      </Typography>
      {data.map((category) => (
        <Box
          key={category.name}
          sx={{ p: 2, mb: 2, backgroundColor: "white", borderRadius: 2 }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {category.name}
          </Typography>
          {category.settings.map((setting) => (
            <SettingField
              key={setting.keyName}
              setting={setting}
              control={control}
              errors={errors}
              setValue={setValue}
              reset={reset}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default SettingsPage;
