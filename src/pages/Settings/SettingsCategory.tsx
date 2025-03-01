import { Box, Typography } from "@mui/material";
import { Control, FieldErrors, UseFormReset, UseFormSetValue } from "react-hook-form";
import { SettingsWrapperInterface } from "../../components/datatypes/DataTypes";
import SettingField from "./SettingsField";

interface Props {
	category: SettingsWrapperInterface;
	control: Control<any>;
	errors: FieldErrors;
	setValue: UseFormSetValue<any>;
	reset: UseFormReset<any>;
}

const SettingCategory = ({ category, control, errors, setValue, reset }: Props) => {
	return (
		<Box sx={{ p: 2, mb: 2, backgroundColor: "white" }}>
			<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
				{category.category}
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
	);
};

export default SettingCategory;
