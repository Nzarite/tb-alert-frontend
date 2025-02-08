import { Divider, Grid } from "@mui/material";
import patientData from "../../components/Json/PatientMedicalRecords.json";
import { renderField } from "./PatientNikshayDetails";

const PatientMedicalDetails = () => {
	const fields = [
		{ name: "dateOfDiagnosis", label: "Date of Diagnosis", size: 6 },
		{ name: "dateOfTreatmentInitiation", label: "Date of Treatment Initiation", size: 6 },
		{ name: "typeOfPwtb", label: "Type of PwTB", size: 6 },
		{ name: "typeOfTb", label: "Type of TB", size: 6 },
		{ name: "dstbOrDrtb", label: "DSTB/DRTB", size: 6 },
	];

	return (
		<>
			<Divider sx={{ mb: 4 }} />
			<Grid container spacing={3} sx={{ padding: "0px 40px" }}>
				{fields.map((item, index) => renderField(patientData, item, index))}
			</Grid>
		</>
	);
};

export default PatientMedicalDetails;
