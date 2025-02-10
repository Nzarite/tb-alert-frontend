import { Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { renderField } from "./PatientNikshayDetails";

const PatientMedicalDetails = () => {
	const [patientData, setPatientData] = useState(null);
	const fields = [
		{ name: "dateOfDiagnosis", label: "Date of Diagnosis", size: 6 },
		{ name: "dateOfTreatmentInitiation", label: "Date of Treatment Initiation", size: 6 },
		{ name: "typeOfPwtb", label: "Type of PwTB", size: 6 },
		{ name: "typeOfTb", label: "Type of TB", size: 6 },
		{ name: "dstbOrDrtb", label: "DSTB/DRTB", size: 6 },
	];

	useEffect(() => {
		const id = 1;
		const getData = async () => {
			const res = await axiosInstance.get(`tbdetails/${id}`);
			setPatientData(res.data);
		};

		getData();
	}, []);

	return (
		<>
			<Divider sx={{ mb: 4 }} />
			{patientData ? (
				<Grid container spacing={3} sx={{ padding: "0px 40px" }}>
					{fields.map((item, index) => renderField(patientData, item, index))}
				</Grid>
			) : (
				<Typography align="center" variant="body2" color="textSecondary">
					Unable to fetch data
				</Typography>
			)}
		</>
	);
};

export default PatientMedicalDetails;
