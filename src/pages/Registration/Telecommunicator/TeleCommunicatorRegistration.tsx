import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Divider,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
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

const TeleCommunicationRegistration = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		control,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
	});

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
				Register TeleCommunicator
			</Typography>
			<Divider sx={{ marginBottom: "30px" }} />
			<Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
				<Stack spacing={3}>
					<Box sx={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
						{/* First Name */}
						<TextField
							label="First Name"
							placeholder="Enter First Name"
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
							{...register("firstName")}
							fullWidth
						/>

						{/* Last Name */}
						<TextField
							label="Last Name"
							placeholder="Enter Last Name"
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
							{...register("lastName")}
							fullWidth
						/>
					</Box>

					{/* Username */}
					<TextField
						label="Username"
						placeholder="Enter Username"
						error={!!errors.username}
						helperText={errors.username?.message}
						{...register("username")}
					/>

					{/* Email */}
					<TextField
						label="Email"
						placeholder="Enter Email"
						error={!!errors.email}
						helperText={errors.email?.message}
						{...register("email")}
					/>

					{/* Contact */}
					<TextField
						label="Contact"
						placeholder="Enter Phone Number"
						error={!!errors.contact}
						helperText={errors.contact?.message}
						{...register("contact")}
					/>

					{/* State */}
					<TextField
						label="State"
						placeholder="Enter Phone Number"
						{...register("state")}
						value={StateData[0].label}
						disabled
					/>

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

export default TeleCommunicationRegistration;
