import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import z from "zod";
import categories from "../../components/Json/settings.json";
import SettingField from "./SettingsField";

const StyledPaper = styled(Paper)({
  padding: "20px",
  marginBottom: "20px",
  transition: "all 0.3s ease-in-out",
  border: "none",
});

const createSchema = (categories) => {
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
const validationSchema = createSchema(categories);

const SettingsPage = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: categories.reduce((acc, category) => {
      category.settings.forEach((setting) => {
        acc[setting.keyName] =
          setting.value || (setting.type === "chips" ? [] : "");
      });
      return acc;
    }, {}),
    mode: "all", // Validate on every change
  });

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", padding: 1 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Settings
      </Typography>
      <form>
        {categories.map((category) => (
          <StyledPaper key={category.name}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {category.name}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {category.settings.map((setting) => (
              <SettingField
                key={setting.keyName}
                setting={setting}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            ))}
          </StyledPaper>
        ))}
      </form>
    </Box>
  );
};

export default SettingsPage;
