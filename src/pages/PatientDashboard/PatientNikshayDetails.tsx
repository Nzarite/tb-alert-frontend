import { Divider, Grid, Typography } from "@mui/material";
import { DashboardFieldsProp } from "../../components/datatypes/DataTypes";
import patientData from "../../components/Json/PatientNikshayDetails.json";

export const renderField = (data, item: DashboardFieldsProp, index: number) => {
	return (
		<Grid item xs={item.size} key={index}>
			<Typography variant="subtitle2" fontWeight="bold" sx={{ color: "gray" }}>
				{item.label.toUpperCase()}:
			</Typography>
			<Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
				{data[item.name] !== null ? data[item.name] : "N/A"}
			</Typography>
		</Grid>
	);
};

const PatientNikshayDetails = () => {
	const fields = [
		{ name: "nikshayId", label: "Nikshay ID", size: 12 },
		{ name: "nikshayMitraName", label: "Nikshay Mitra Name", size: 4 },
		{ name: "nikshayMitraDate", label: "Nikshay Mitra Date", size: 4 },
		{ name: "nikshayMitraStatus", label: "Nikshay Mitra Status", size: 4 },
		{ name: "dateOfUdst", label: "UDST Date", size: 4 },
		{ name: "udstStatus", label: "UDST Status", size: 4 },
		{ name: "resultOfUdst", label: "Result", size: 4 },
		{ name: "dateOfDbt", label: "DBT Date", size: 4 },
		{ name: "dbtStatus", label: "DBT Status", size: 4 },
	];

	return (
		<>
			<Typography variant="h5" sx={{ fontWeight: "bold", marginTop: 1, marginBottom: 2 }}>
				Nikshay Details
			</Typography>
			<Divider sx={{ mb: 4 }} />
			<Grid container spacing={2} sx={{ padding: "0px 40px" }}>
				{fields.map((item, index) => renderField(patientData, item, index))}
			</Grid>
		</>
	);
};

export default PatientNikshayDetails;
