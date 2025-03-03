import {
	Autocomplete,
	createFilterOptions,
	FormControl,
	FormHelperText,
	Select,
	TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldErrors, UseFormSetValue } from "react-hook-form";
import { SettingsInterface } from "../../components/datatypes/DataTypes";
import stateList from "../../components/Json/states.json";
import AddMedicationDialog from "./AddMedicationDialog";
import { fetchMedications } from "./settingsService";

interface Props {
	field: ControllerRenderProps<any, string>;
	setting: SettingsInterface;
	options?: string[];
	errors: FieldErrors;
	editable: boolean;
	setValue: UseFormSetValue<any>;
	loadSettings: () => void;
}

const filter = createFilterOptions();

const RenderSettingItem = ({ field, setting, errors, editable, setValue, loadSettings }: Props) => {
	const [options, setOptions] = useState([]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [newMedication, setNewMedication] = useState("");

	useEffect(() => {
		const loadOptions = async () => {
			if (setting.keyName.includes("medicines")) {
				try {
					const medications = await fetchMedications();
					setOptions(medications);
				} catch (error) {
					console.error("Error fetching medications:", error);
					setOptions([]);
				}
			} else if (setting.keyName === "state") setOptions(stateList);
		};

		loadOptions();
	}, [setting.keyName]);

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
					disabled={!editable}
				/>
			);
		case "longtext":
			return (
				<TextField
					{...field}
					multiline
					rows={5}
					size="small"
					sx={{ width: "80%" }}
					variant="outlined"
					error={!!errors[setting.keyName]}
					helperText={errors[setting.keyName]?.message || setting.placeholder}
					disabled={!editable}
				/>
			);
		case "time":
			return (
				<TextField
					{...field}
					type="time"
					size="small"
					sx={{ width: "80%" }}
					variant="outlined"
					error={!!errors[setting.keyName]}
					helperText={errors[setting.keyName]?.message || setting.placeholder}
					disabled={!editable}
				/>
			);
		case "chips":
			return (
				<>
					<Autocomplete
						multiple
						freeSolo
						options={options}
						value={Array.isArray(field.value) ? field.value : []}
						onChange={(_, newValue) => {
							const lastAdded = newValue[newValue.length - 1];

							if (lastAdded && !options.includes(lastAdded)) {
								setNewMedication(lastAdded);
								setConfirmOpen(true);
							} else {
								setValue(setting.keyName, newValue);
							}
						}}
						filterOptions={(options, params) => {
							const filtered = filter(options, params);
							const { inputValue } = params;

							if (inputValue !== "" && !options.includes(inputValue)) {
								filtered.push(inputValue);
							}

							return filtered;
						}}
						size="small"
						sx={{ width: "80%" }}
						disabled={!editable}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="outlined"
								error={!!errors[setting.keyName]}
								helperText={errors[setting.keyName]?.message || setting.placeholder}
							/>
						)}
					/>

					{/* Confirmation Dialog for New Medication */}
					<AddMedicationDialog
						confirmOpen={confirmOpen}
						setConfirmOpen={setConfirmOpen}
						newMedication={newMedication}
						options={options}
						setOptions={setOptions}
						setValue={setValue}
						setting={setting}
						field={field}
						loadSettings={loadSettings}
					/>
				</>
			);
		case "select":
			return (
				<FormControl sx={{ width: "80%" }} size="small" error={!!errors[setting.keyName]}>
					<Select
						{...field}
						native
						disabled={!editable}
						onChange={(event) =>
							setValue(setting.keyName, {
								stateName: event.target.selectedOptions[0].textContent.toUpperCase(),
								stateCode: event.target.value,
							})
						}
						value={field.value?.stateCode || ""}>
						{options.map((state) => (
							<option key={state.value.stateCode} value={state.value.stateCode}>
								{state.label}
							</option>
						))}
					</Select>
					<FormHelperText>{setting.placeholder}</FormHelperText>
				</FormControl>
			);
		default:
			return null;
	}
};

export default RenderSettingItem;
