import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { VisitDataInterface } from "../../components/VisitDataTypes";

interface FollowUpFormComponentProps {
	index: number;
	data: VisitDataInterface | null;
}

const schema = z.object({
	currentStatus: z.string(),
	remarks: z.string().min(1, "Description can't be null"),
	missedMedications: z.array(
		z.object({
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

const FollowUpFormComponent = ({ index, data }: FollowUpFormComponentProps) => {
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
					missedDosages: med.missedDosages ?? 0,
					comments: med.comments ?? "",
				})) || [],
		},
	});

	const formSubmitHandler = (data: FormData) => {
		console.log("Submitted Data: ", data);
	};

	const MedicationRow = ({ medicine, index, control, errors }) => (
		<div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
			<Typography variant="body1" sx={{ marginTop: 2.5 }}>
				{medicine.medicationName}:
			</Typography>
			<Controller
				name={`missedMedications.${index}.missedDosages`}
				control={control}
				defaultValue={medicine.missedDosages ?? ""}
				render={({ field }) => (
					<TextField
						{...field}
						label="Missed Doses"
						placeholder="Enter missed doses"
						fullWidth
						error={!!errors.missedMedications?.[index]?.missedDosages}
						helperText={errors.missedMedications?.[index]?.missedDosages?.message}
					/>
				)}
			/>
			<Controller
				name={`missedMedications.${index}.comments`}
				control={control}
				defaultValue={medicine.comments ?? ""}
				render={({ field }) => (
					<TextField
						{...field}
						label="Comments"
						placeholder="Enter comments"
						multiline
						fullWidth
						error={!!errors.missedMedications?.[index]?.comments}
						helperText={errors.missedMedications?.[index]?.comments?.message}
					/>
				)}
			/>
		</div>
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
					{/* Heading */}
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

							{data?.followUpDetails[index].medicationDetails.map(
								(medicine, index) => (
									<MedicationRow
										key={medicine.medicationId}
										medicine={medicine}
										index={index}
										errors={errors}
										control={control}
									/>
								)
							)}

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
				<Typography>No Follow ups Found</Typography>
			)}
		</Paper>
	);
};

export default FollowUpFormComponent;
