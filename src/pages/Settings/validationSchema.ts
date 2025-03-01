import z from "zod";
import { SettingsWrapperInterface } from "../../components/datatypes/DataTypes";

const createValidationSchema = (categories: SettingsWrapperInterface[]) => {
	const schemaObj: Record<string, any> = {};

	categories.forEach((category) =>
		category.settings.forEach((setting) => {
			switch (setting.type) {
				case "text":
				case "longtext":
					schemaObj[setting.keyName] = z.string().min(1, "This field is required");
					break;
				case "number":
					schemaObj[setting.keyName] = z
						.string()
						.min(1, "This field is required")
						.regex(/^\d+$/, "Please enter a valid number")
						.refine((value) => parseInt(value) > 0, {
							message: "Please enter a positive number",
						});
					break;
				case "time":
					schemaObj[setting.keyName] = z.string().min(1, "Please select a time");
					break;
				case "chips":
					schemaObj[setting.keyName] = z
						.array(z.string())
						.min(1, "Select at least one item");
					break;
			}
		})
	);

	return z.object(schemaObj);
};

export default createValidationSchema;
