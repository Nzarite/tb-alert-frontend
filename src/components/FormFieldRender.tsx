import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

interface FieldConfig {
	name: string;
	label: string;
	placeholder?: string;
	type: string;
	options?: { label: string; value: string }[];
	value?: string;
	disabled: boolean;
}

interface FormFieldRendererProps {
	field: FieldConfig;
	control: any;
	errors: any;
}

const FormFieldRenderer = ({ field, control, errors }: FormFieldRendererProps) => {
	const { name, label, placeholder, type, options, value, disabled } = field;

	switch (type) {
		case "text":
			return (
				<Controller
					key={name}
					name={name}
					control={control}
					defaultValue={value || ""}
					render={({ field }) => (
						<TextField
							{...field}
							label={label}
							placeholder={placeholder}
							error={!!errors[name]}
							helperText={errors[name]?.message}
							fullWidth
							disabled={disabled}
						/>
					)}
				/>
			);
		case "select":
			return (
				<FormControl key={name} error={!!errors[name]} fullWidth>
					<InputLabel>{label}</InputLabel>
					<Controller
						name={name}
						control={control}
						defaultValue={value || ""}
						render={({ field }) => (
							<Select {...field} label={label} disabled={disabled}>
								{options?.map((c) => (
									<MenuItem key={c.value} value={c.value}>
										{c.label}
									</MenuItem>
								))}
							</Select>
						)}
						disabled={disabled}
					/>
					<FormHelperText>{errors[name]?.message}</FormHelperText>
				</FormControl>
			);
		default:
			return null;
	}
};

export default FormFieldRenderer;
