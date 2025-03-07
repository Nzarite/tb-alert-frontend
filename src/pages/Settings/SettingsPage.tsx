import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  SettingsInterface,
  SettingsWrapperInterface,
} from "../../components/datatypes/DataTypes";
import SettingCategory from "./SettingsCategory";
import { fetchSettings } from "./settingsService";
import createValidationSchema from "./validationSchema";

const SettingsPage = () => {
  const [data, setData] = useState<SettingsWrapperInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState({});

  const loadSettings = async () => {
    try {
      const settingsData = await fetchSettings();
      setData(settingsData);

      // Generate default values
      const initialValues = settingsData.reduce(
        (acc, category: SettingsWrapperInterface) => {
          category.settings.forEach(
            (setting: SettingsInterface) =>
              (acc[setting.keyName] =
                setting.type === "chips"
                  ? setting.value.split(",")
                  : setting.value)
          );
          return acc;
        },
        {}
      );

      setDefaultValues(initialValues);
      reset(initialValues); // Ensure form values update
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // The validation schema will be memoized to prevent unnecessary re-renders
  const validationSchema = useMemo(() => createValidationSchema(data), [data]);

  const {
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues,
    mode: "all",
  });

  // Reset form when defaultValues are updated
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  return (
    <Box sx={{ maxWidth: "90%", margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Settings
      </Typography>
      {data ? (
        data.map((category) => (
          <SettingCategory
            key={category.category}
            category={category}
            control={control}
            errors={errors}
            setValue={setValue}
            reset={reset}
            loadSettings={loadSettings}
          />
        ))
      ) : (
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No settings available.
        </Typography>
      )}
    </Box>
  );
};

export default SettingsPage;
