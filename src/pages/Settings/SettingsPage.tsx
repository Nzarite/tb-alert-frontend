import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import z from "zod";
import categories from "../../components/Json/settings.json";
import SettingField from "./SettingsField";

const createSchema = (categories) => {
	const schemaObj = {};

	categories.forEach((category) => {
		category.settings.forEach((setting) => {
			switch (setting.type) {
				case "text":
					schemaObj[setting.keyName] = z.string().min(1, "This field is required");
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
					schemaObj[setting.keyName] = z.string().min(1, "Please select a time");
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
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues: categories.reduce((acc, category) => {
			category.settings.forEach((setting) => {
				acc[setting.keyName] = setting.value || "";
			});
			return acc;
		}, {}),
	});
	return (
		<Box sx={{ maxWidth: 1000, margin: "auto", padding: 1 }}>
			<Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
				Settings
			</Typography>
			{categories.map((category) => (
				<Box
					key={category.name}
					sx={{ p: 2, mb: 2, border: "1px solid #ddd", borderRadius: 2 }}>
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
