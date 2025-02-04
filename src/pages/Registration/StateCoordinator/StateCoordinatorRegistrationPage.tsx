import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
	isPatientAlive: z.boolean(),
	recoveryStatus: z.string().min(10, "Description must be at least 10 characters long"),
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

const StateCoordinatorRegistrationPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
	});

	const formSubmitHandler = (data: FormData) => {
		console.log("Submitted Data: ", data);
	};

	return (
		<Box>
			<Box component="form" onSubmit={handleSubmit(formSubmitHandler)}>
				<TextField label="First Name" placeholder="Enter First Name" />
				<TextField label="Last Name" placeholder="Enter Fast Name" />
				<TextField label="Username" placeholder="Enter username" />
				<TextField label="Email" placeholder="Enter email" />
				<TextField label="Contact" placeholder="Enter Phone Number" />
				<Button>Reset</Button>
				<Button variant="outlined">Submit</Button>
			</Box>
		</Box>
	);
};

export default StateCoordinatorRegistrationPage;
