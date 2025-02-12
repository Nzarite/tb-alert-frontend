import { Divider, Grid, Typography } from "@mui/material";
import patientData from "../../components/Json/PatientPersonalDetails.json";
import { DashboardFieldsProp } from "../../components/datatypes/DataTypes";

const PatientPersonalDetails = () => {
	const fields = [
		{ name: "patientId", label: "Patient ID", size: "large" },
		{ name: "firstName", label: "First Name", size: "small" },
		{ name: "lastName", label: "Last Name", size: "small" },
		{ name: "gender", label: "Gender", size: "small" },
		{ name: "dateOfBirth", label: "DOB", size: "small" },
		{ name: "phone", label: "Contact", size: "small" },
		{ name: "block", label: "Block", size: "small" },
		{ name: "gp", label: "Gram Panchayat", size: "small" },
		{ name: "village", label: "Village", size: "small" },
		{ name: "district", label: "District", size: "small" },
		{ name: "currentStatus", label: "Status", size: "small" },
	];

	const renderField = (item: DashboardFieldsProp, index: number) => {
		if (item.size === "small") {
			return (
				<Grid item xs={6} key={index}>
					<Typography variant="body1" fontWeight="bold">
						{item.label.toUpperCase()}:
					</Typography>
					<Typography variant="body1">
						{patientData[item.name] !== null ? patientData[item.name] : "N/A"}
					</Typography>
				</Grid>
			);
		} else {
			return (
				<Grid item xs={12} key={index}>
					<Typography variant="body1" fontWeight="bold">
						{item.label.toUpperCase()}:
					</Typography>
					<Typography variant="body1">
						{patientData[item.name] !== null ? patientData[item.name] : "N/A"}
					</Typography>
				</Grid>
			);
		}
	};
	return (
		<>
			<Typography variant="h5" sx={{ marginTop: 1, marginBottom: 2 }}>
				Personal Details
			</Typography>
			<Divider sx={{ mb: 4 }} />
			<Grid container spacing={2} sx={{ padding: "0px 40px" }}>
				{fields.map((item, index) => renderField(item, index))}
			</Grid>
		</>
	);
};

export default PatientPersonalDetails;
