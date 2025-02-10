import { Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { renderField } from "./PatientNikshayDetails";

const PatientPersonalDetails = () => {
	const [patientData, setPatientData] = useState(null);
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

	useEffect(() => {
		const id = 1;
		const getData = async () => {
			const res = await axiosInstance.get(`patient/${id}`);
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

export default PatientPersonalDetails;
