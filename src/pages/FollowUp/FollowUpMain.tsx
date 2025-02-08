import { zodResolver } from "@hookform/resolvers/zod";
import StarIcon from "@mui/icons-material/Star";
import {
	Box,
	Button,
	Divider,
	Paper,
	Rating,
	Stack,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MedicationInterface, VisitDataInterface } from "../../components/datatypes/DataTypes";
import { RiPencilFill } from "react-icons/ri";

interface Props {
	index: number;
	data: VisitDataInterface | null;
}

// Labels for the rating control
const labels: { [key: number]: string } = {
	1: "Need Urgent Support",
	2: "Poor",
	3: "Ok",
	4: "Improving",
	5: "Excellent",
};

// Updated schema: currentStatus as boolean, patientCondition as number, etc.
const schema = z.object({
	currentStatus: z.boolean(),
	patientCondition: z.number(),
	remarks: z.string().min(1, "Description can't be null"),
	missedMedications: z.array(
		z.object({
			medicationName: z.string(),
			missedDosages: z
				.string()
				.min(1, "Please enter a number")
				.regex(/^\d+$/, { message: "Input must be a valid number" })
				.transform(Number)
				.refine((val) => val >= 0, { message: "Missed doses cannot be negative" }),
			comments: z.string().optional(),
		})
	),
});

type FormData = z.infer<typeof schema>;

const FollowUpFormComponent = ({ index, data }: Props) => {
	const [isEditable, setIsEditable] = useState(false); // Add editable state
	const [hover, setHover] = useState(-1);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			currentStatus: data?.patient.currentStatus ?? false,
			patientCondition: data?.followUpDetails[index]?.patientCondition ?? 4,
			remarks: data?.followUpDetails[index]?.remarks ?? "",
			missedMedications:
				data?.followUpDetails[index]?.medicationDetails?.map((med) => ({
					medicationName: med.medicationName,
					missedDosages: med.missedDosages?.toString() ?? "",
					comments: med.comments ?? "",
				})) || [],
		},
	});

	// Reset form values when the selected follow-up (index or data) changes.
	useEffect(() => {
		if (data) {
			reset({
				currentStatus: data.patient.currentStatus ?? false,
				patientCondition: data.followUpDetails[index]?.patientCondition ?? 3,
				remarks: data.followUpDetails[index]?.remarks ?? "",
				missedMedications:
					data.followUpDetails[index]?.medicationDetails?.map((med) => ({
						medicationName: med.medicationName,
						missedDosages: med.missedDosages?.toString() ?? "",
						comments: med.comments ?? "",
					})) || [],
			});
		}
	}, [index, data, reset, isEditable]);

	// Helper function for rating labels
	function getLabelText(value: number) {
		return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
	}

	const formSubmitHandler = (formData: FormData) => {
		console.log("Submitted Data: ", formData);
		setIsEditable(false);
	};

	// MedicationRow component uses Controller for each dynamic field.
	const MedicationRow = ({
		medicine,
		medIndex,
	}: {
		medicine: MedicationInterface;
		medIndex: number;
	}) => (
		<TableRow key={medicine.medicationId}>
			<TableCell>
				<Typography>{medicine.medicationName}</Typography>
			</TableCell>
			<TableCell>
				<Controller
					name={`missedMedications.${medIndex}.missedDosages`}
					control={control}
					disabled={!isEditable}
					defaultValue={medicine.missedDosages?.toString() || ""}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							fullWidth
							error={!!errors.missedMedications?.[medIndex]?.missedDosages}
							helperText={
								errors.missedMedications?.[medIndex]?.missedDosages?.message
							}
						/>
					)}
				/>
			</TableCell>
			<TableCell>
				<Controller
					name={`missedMedications.${medIndex}.comments`}
					control={control}
					defaultValue={medicine.comments || ""}
					disabled={!isEditable}
					render={({ field }) => (
						<TextField
							{...field}
							fullWidth
							multiline
							error={!!errors.missedMedications?.[medIndex]?.comments}
							helperText={errors.missedMedications?.[medIndex]?.comments?.message}
						/>
					)}
				/>
			</TableCell>
		</TableRow>
	);

	return (
		<Paper
			variant="outlined"
			sx={{
				height: "77vh",
				overflow: "auto",
				padding: 4,
				marginTop: 1,
			}}>
			{data ? (
				<>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Follow Up {index + 1}{" "}
						<RiPencilFill onClick={() => setIsEditable(!isEditable)} />
						<Typography variant="subtitle1">
							{data.followUpDetails[index].date}
						</Typography>
					</Typography>
					<Divider variant="fullWidth" sx={{ mb: 3 }} />
					<Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
						<Stack spacing={4}>
							{/* Patient Condition Switch via Controller */}
							<Controller
								name="currentStatus"
								control={control}
								disabled={!isEditable}
								render={({ field }) => (
									<div style={{ display: "flex", alignItems: "center" }}>
										<Typography variant="subtitle1">
											Is Patient Alive ?
										</Typography>
										<Switch
											{...field}
											checked={field.value}
											onChange={(e) => field.onChange(e.target.checked)}
										/>
									</div>
								)}
							/>

							{/* Patient Condition (Rating) via Controller */}
							<Controller
								name="patientCondition"
								control={control}
								render={({ field: { value, onChange } }) => (
									<div
										style={{
											display: "flex",
											gap: "10px",
											alignItems: "center",
										}}>
										<Rating
											name="patientCondition"
											value={value}
											getLabelText={getLabelText}
											onChange={(_, newValue) => onChange(newValue)}
											onChangeActive={(_, newHover) => setHover(newHover)}
											disabled={!isEditable}
											emptyIcon={
												<StarIcon
													style={{ opacity: 0.55 }}
													fontSize="inherit"
												/>
											}
										/>
										{value !== null && (
											<Box>{labels[hover !== -1 ? hover : value]}</Box>
										)}
									</div>
								)}
							/>

							{/* Patient Condition Description */}
							<TextField
								id="recoveryStatus-desc"
								label="Recovery Status"
								placeholder="Enter the condition of the patient in detail"
								multiline
								rows={3}
								error={!!errors.remarks}
								helperText={errors.remarks?.message}
								disabled={!isEditable}
								{...register("remarks")}
								InputLabelProps={{
									shrink:
										watch("remarks") !== undefined &&
										watch("remarks").length > 0,
								}}
							/>

							{/* Medications Table */}
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Medication Name</TableCell>
											<TableCell>Missed Doses</TableCell>
											<TableCell>Comments</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data?.followUpDetails[index].medicationDetails.length >
										0 ? (
											data.followUpDetails[index].medicationDetails.map(
												(medicine, medIndex) => (
													<MedicationRow
														key={medicine.medicationId}
														medicine={medicine}
														medIndex={medIndex}
													/>
												)
											)
										) : (
											<TableRow>
												<TableCell colSpan={3} align="center">
													<Typography
														variant="body2"
														color="textSecondary">
														No Medications Found
													</Typography>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>

							<Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
								<Button
									variant="outlined"
									color="primary"
									onClick={() => reset()}
									disabled={!isEditable}>
									Cancel
								</Button>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									disabled={!isValid || !isEditable}>
									Submit
								</Button>
							</Box>
						</Stack>
					</Box>
				</>
			) : (
				<Typography align="center">Please Search for a Patient</Typography>
			)}
		</Paper>
	);
};

export default FollowUpFormComponent;
