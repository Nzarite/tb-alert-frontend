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
		{ name: "nikshayMitraName", label: "Nikshay Mitra Name", size: 6 },
		{ name: "nikshayMitraDate", label: "Nikshay Mitra Date", size: 6 },
		{ name: "nikshayMitraStatus", label: "Nikshay Mitra Status", size: 12 },
		{ name: "dateOfUdst", label: "UDST Date", size: 6 },
		{ name: "udstStatus", label: "UDST Status", size: 6 },
		{ name: "resultOfUdst", label: "Result", size: 12 },
		{ name: "dateOfDbt", label: "DBT Date", size: 6 },
		{ name: "dbtStatus", label: "DBT Status", size: 6 },
	];

	return (
		<>
			<Divider sx={{ mb: 4 }} />
			<Grid container spacing={2} sx={{ padding: "0px 40px" }}>
				{fields.map((item, index) => renderField(patientData, item, index))}
			</Grid>
		</>
	);
};

export default PatientNikshayDetails;
