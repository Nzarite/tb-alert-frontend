import { Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import { DashboardFieldsProp } from "../../components/datatypes/DataTypes";

export const renderField = (data, item: DashboardFieldsProp, index: number) => {
	const fieldValue = data[item.name];
	const displayValue =
	fieldValue === true ? "Yes" :
	fieldValue === false ? "No" :
	fieldValue !== null && fieldValue !== undefined && fieldValue !== "" ? fieldValue : "N/A";
	
	return (
		<Grid item xs={item.size} key={index}>
			<Typography variant="subtitle2" fontWeight="bold" sx={{ color: "gray" }}>
				{item.label.toUpperCase()}:
			</Typography>
			<Typography variant="body1" sx={{ fontWeight: "medium", color: "#333" }}>
				{typeof displayValue === "string" || typeof displayValue === "number"
					? displayValue
					: "N/A"}
			</Typography>
		</Grid>
	);
};

const PatientContactScreeningDetails = (patientId:any) => {
	const [patientData, setPatientData] = useState(null);

	const fields = [
		{ name: "contactScreeningDone", label: "Contact Screen Status", size: 6 },
		{ name: "dateOfContactScreening", label: "Date of Contact Screening", size: 6 },
		{ name: "noOfHHCsAvailable", label: "No. of Household Contacts(HHC) Available", size: 6 },
		{ name: "noOfHHCsScreened", label: "No. of HHCs Screened", size: 6 },
		{ name: "noOfHHCsWithTBSymptoms", label: "No. of HHCs with TB Symptoms", size: 6 },
		{
			name: "noOfHHCsReferredTBTesting",
			label: "No. of HHCs referred for TB Testing",
			size: 6,
		},
		{ name: "noOfHHCsDiagnosedTB", label: "No. of HHCs diagnosed with TB", size: 6 },
		{ name: "noOfHHCsTBInitiatedATT", label: "No. of HHCs who initiated ATT", size: 6 },
		{ name: "noOfHHCsUndergoneLTBITest", label: "No. of HHCs undergone LTBI test", size: 6 },
		{ name: "noOfEligibleForTPT", label: "No. of HHCs Eligible for TPT", size: 6 },
		{ name: "noOfHHCsInitiatedTPT", label: "No. of HHCs who initiated TPT", size: 6 },
	];

	useEffect(() => {
		const getData = async () => {
			const res = await axiosInstance.get(`contactscreening/${patientId.patientId}`);
			setPatientData(res.data);
			console.log(res.data)
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

export default PatientContactScreeningDetails;
