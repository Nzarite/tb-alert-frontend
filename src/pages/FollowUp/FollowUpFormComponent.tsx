import {
	Box,
	Button,
	Divider,
	Paper,
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MedicationInterface, VisitDataInterface } from "../../components/VisitDataTypes";

interface Props {
	index: number;
	data: VisitDataInterface | null;
}

const schema = z.object({
	currentStatus: z.string(),
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

const FollowUpFormComponent = ({ index, data }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
		control,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			remarks: data?.followUpDetails[index].remarks ?? "",
			missedMedications:
				data?.followUpDetails[index].medicationDetails?.map((med) => ({
					medicationName: med.medicationName,
					missedDosages: med.missedDosages ?? 0,
					comments: med.comments ?? "",
				})) || [],
		},
	});

	const formSubmitHandler = (data: FormData) => {
		console.log("Submitted Data: ", data);
	};

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
						Follow Up {index + 1}
						<Typography variant="subtitle1">
							{data.followUpDetails[index].date}
						</Typography>
					</Typography>
					<Divider variant="fullWidth" sx={{ mb: 3 }} />
					<Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
						<Stack spacing={4}>
							{/* Patient Condition Switch */}
							<div style={{ display: "flex", alignItems: "center" }}>
								<Typography variant="subtitle1">Is Patient Alive ?</Typography>
								<Switch {...register("currentStatus")} />
							</div>

							{/* Patient Condition Description */}
							<TextField
								id="recoveryStatus-desc"
								label="Recovery Status"
								placeholder="Enter the condition of the patient in detail"
								multiline
								rows={3}
								error={!!errors.remarks}
								helperText={errors.remarks?.message}
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
												(
													medicine: MedicationInterface,
													medIndex: number
												) => (
													<TableRow key={medicine.medicationId}>
														<TableCell>
															<Typography>
																{medicine.medicationName}
															</Typography>
														</TableCell>
														<TableCell>
															<Controller
																name={`missedMedications.${medIndex}.missedDosages`}
																control={control}
																defaultValue={
																	medicine.missedDosages ?? ""
																}
																render={({ field }) => (
																	<TextField
																		{...field}
																		type="number"
																		variant="standard"
																		fullWidth
																		error={
																			!!errors
																				.missedMedications?.[
																				medIndex
																			]?.missedDosages
																		}
																		helperText={
																			errors
																				.missedMedications?.[
																				medIndex
																			]?.missedDosages
																				?.message
																		}
																	/>
																)}
															/>
														</TableCell>
														<TableCell>
															<Controller
																name={`missedMedications.${medIndex}.comments`}
																control={control}
																defaultValue={
																	medicine.comments ?? ""
																}
																render={({ field }) => (
																	<TextField
																		{...field}
																		variant="standard"
																		fullWidth
																		multiline
																		error={
																			!!errors
																				.missedMedications?.[
																				medIndex
																			]?.comments
																		}
																		helperText={
																			errors
																				.missedMedications?.[
																				medIndex
																			]?.comments?.message
																		}
																	/>
																)}
															/>
														</TableCell>
													</TableRow>
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

							<Divider variant="fullWidth" sx={{ mb: 4 }} />

							<Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
								<Button variant="outlined" color="primary" onClick={() => reset()}>
									Cancel
								</Button>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									disabled={!isValid}>
									Submit
								</Button>
							</Box>
						</Stack>
					</Box>
				</>
			) : (
				<Typography>No Follow-ups Found</Typography>
			)}
		</Paper>
	);
};

export default FollowUpFormComponent;
