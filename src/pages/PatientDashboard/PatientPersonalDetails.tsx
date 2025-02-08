import { Divider, Grid, Typography } from "@mui/material";
import patientData from "../../components/Json/PatientPersonalDetails.json";
import { renderField } from "./PatientNikshayDetails";

const PatientPersonalDetails = () => {
	const fields = [
		{ name: "patientId", label: "Patient ID", size: 12 },
		{ name: "firstName", label: "First Name", size: 6 },
		{ name: "lastName", label: "Last Name", size: 6 },
		{ name: "gender", label: "Gender", size: 6 },
		{ name: "dateOfBirth", label: "DOB", size: 6 },
		{ name: "phone", label: "Contact", size: 6 },
		{ name: "block", label: "Block", size: 6 },
		{ name: "gp", label: "Gram Panchayat", size: 6 },
		{ name: "village", label: "Village", size: 6 },
		{ name: "district", label: "District", size: 6 },
		{ name: "currentStatus", label: "Status", size: 6 },
	];

	return (
		<>
			<Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 1, marginBottom: 2 }}>
				Personal Details
			</Typography>
			<Divider sx={{ mb: 4 }} />
			<Grid container spacing={3} sx={{ padding: "0px 40px" }}>
				{fields.map((item, index) => renderField(patientData, item, index))}
			</Grid>
		</>
	);
};

export default PatientPersonalDetails;
