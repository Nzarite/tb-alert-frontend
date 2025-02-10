import { Grid, Typography, Divider } from "@mui/material";
import { DashboardFieldsProp } from "../../components/datatypes/DataTypes";

const PatientNikshayDetails = () => {
	// const fields = [
	// 	{ name: "dateOfDiagnosis", label: "Date of Diagnosis", size: "small" },
	// 	{ name: "dateOfTreatmentInitiation", label: "Date of Treatment Initiation", size: "small" },
	// 	{ name: "typeOfPwtb", label: "Type of PwTB", size: "small" },
	// 	{ name: "typeOfTb", label: "Type of TB", size: "small" },
	// 	{ name: "dstbOrDrtb", label: "DSTB/DRTB", size: "small" },
	// ];

	// const renderField = (item: DashboardFieldsProp, index: number) => {
	// 	if (item.size === "small") {
	// 		return (
	// 			<Grid item xs={6} key={index}>
	// 				<Typography variant="body1" fontWeight="bold">
	// 					{item.label.toUpperCase()}:
	// 				</Typography>
	// 				<Typography variant="body1">
	// 					{PatientMedicationData[item.name] !== null
	// 						? PatientMedicationData[item.name]
	// 						: "N/A"}
	// 				</Typography>
	// 			</Grid>
	// 		);
	// 	} else {
	// 		return (
	// 			<Grid item xs={12} key={index}>
	// 				<Typography variant="body1" fontWeight="bold">
	// 					{item.label.toUpperCase()}:
	// 				</Typography>
	// 				<Typography variant="body1">
	// 					{PatientMedicationData[item.name] !== null
	// 						? PatientMedicationData[item.name]
	// 						: "N/A"}
	// 				</Typography>
	// 			</Grid>
	// 		);
	// 	}
	// };

	// return (
	// 	<>
	// 		<Typography variant="h5" sx={{ marginTop: 1, marginBottom: 2 }}>
	// 			Medical Details
	// 		</Typography>
	// 		<Divider sx={{ mb: 4 }} />
	// 		<Grid container spacing={2} sx={{ padding: "0px 40px" }}>
	// 			{fields.map((item, index) => renderField(item, index))}
	// 		</Grid>
	// 	</>
	// );
	return <>Nikshay Details</>;
};

export default PatientNikshayDetails;
