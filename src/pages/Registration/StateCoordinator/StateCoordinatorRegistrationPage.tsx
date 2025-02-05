import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormFieldRenderer from "../../../components/FormFieldRender";
import StateData from "../../../components/Json/states.json";

const schema = z.object({
	firstName: z.string().min(1, "First name can't be empty"),
	lastName: z.string(),
	username: z.string().min(1, "Username can't be empty"),
	email: z.string().email("Please enter a valid email"),
	state: z.string().nonempty("Please select a state"),
	contact: z
		.string()
		.nonempty("Contact can't be empty")
		.regex(/^\d+$/, "Contact must contain only numbers")
		.min(10, "Contact must be 10 digits"),
});

type FormData = z.infer<typeof schema>;

const StateCoordinatorRegistrationPage = () => {
	const {
		handleSubmit,
		formState: { errors, isValid },
		reset,
		control,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
	});

	const formFields = [
		{
			name: "firstName",
			label: "First Name",
			placeholder: "Enter First Name",
			type: "text",
			disabled: false,
		},
		{
			name: "lastName",
			label: "Last Name",
			placeholder: "Enter Last Name",
			type: "text",
			disabled: false,
		},
		{
			name: "username",
			label: "Username",
			placeholder: "Enter Username",
			type: "text",
			disabled: false,
		},
		{
			name: "email",
			label: "Email",
			placeholder: "Enter Email",
			type: "text",
			disabled: false,
		},
		{
			name: "contact",
			label: "Contact",
			placeholder: "Enter Phone Number",
			type: "text",
			disabled: false,
		},
		{ name: "state", label: "State", type: "select", options: StateData, disabled: false },
	];

	const formSubmitHandler = (data: FormData) => {
		console.log("Submitted Data: ", data);
	};

	return (
		<Paper
			variant="outlined"
			sx={{
				height: "84vh",
				overflow: "auto",
				padding: 4,
				width: "40vw",
				margin: "30px auto 0px auto",
			}}>
			<Typography variant="h5" sx={{ margin: "0px auto 15px auto" }}>
				Register State Coordinator
			</Typography>
			<Divider sx={{ marginBottom: "30px" }} />
			<Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
				<Stack spacing={3}>
					{formFields.map((field) => (
						<FormFieldRenderer
							key={field.name}
							field={field}
							control={control}
							errors={errors}
						/>
					))}

					{/* Buttons */}
					<Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
						<Button onClick={() => reset()} color="inherit">
							Reset
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

export default StateCoordinatorRegistrationPage;
