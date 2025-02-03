import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FollowUpsDataInterface } from "../../components/VisitDataTypes";

interface FollowUpFormComponentProps {
	index: number;
	data: FollowUpsDataInterface;
}

const schema = z.object({
	isPatientAlive: z.boolean(),
	description: z.string().min(10, "Description must be at least 10 characters long"),
	medications: z.array(
		z.object({
			missedDoses: z
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
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
	});

	const formSubmitHandler = (data: FormData) => {
		console.log("Submitted Data: ", data);
	};

	useEffect(() => {
		reset({
			description: "",
			medications: data.medications.map((med) => ({
				missedDoses: "0",
				comments: "",
			})),
		});
	}, [index, data, reset]);

	return (
		<Paper
			variant="outlined"
			sx={{
				height: "77vh",
				overflow: "auto",
				padding: 4,
			}}>
			{/* Heading */}
			<Typography variant="h6" sx={{ mb: 2 }}>
				Follow Up {index} <Typography variant="subtitle1">{data.date}</Typography>
			</Typography>
			<Divider variant="fullWidth" sx={{ mb: 3 }} />

			<Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
				<Stack spacing={4}>
					{/* Patient Condition Switch */}
					<div style={{ display: "flex", alignItems: "center" }}>
						<Typography variant="subtitle1">Is Patient Alive ?</Typography>
						<Switch {...register("isPatientAlive")} />
					</div>

					{/* Patient Condition Description */}
					<TextField
						label="Description"
						placeholder="Enter the condition of the patient in detail"
						multiline
						rows={3}
						error={!!errors.description}
						helperText={errors.description?.message}
						{...register("description")}
					/>

					{/* Patient Medication Data */}
					{data.medications.map((medicine, index) => (
						<div
							style={{ display: "flex", gap: "50px", alignItems: "flex-start" }}
							key={medicine.id}>
							<Typography variant="body1" sx={{ marginTop: 2.5 }}>
								{medicine.nameOfMedicine}:
							</Typography>
							<TextField
								id={`missedDoses-${index}`}
								label="Missed Doses"
								placeholder="Enter no. of doses missed"
								fullWidth
								error={!!errors.medications?.[index]?.missedDoses}
								helperText={errors.medications?.[index]?.missedDoses?.message}
								{...register(`medications.${index}.missedDoses`)}
							/>
							<TextField
								id={`comments-${index}`}
								label="Comments"
								placeholder="Enter Comments"
								multiline
								fullWidth
								{...register(`medications.${index}.comments`)}
							/>
						</div>
					))}

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
		</Paper>
	);
};

export default FollowUpFormComponent;
