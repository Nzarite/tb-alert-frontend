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

const PatientNikshayDetails = (patientId:any) => {
	const [patientData, setPatientData] = useState(null);

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

	useEffect(() => {
		const getData = async () => {
			const res = await axiosInstance.get(`nikshaymitra/${patientId.patientId}`);
			setPatientData(res.data);
		};

		getData();
	}, []);

	return (
		<>
			<Divider sx={{ mb: 4 }} />
			{patientData ? (
				<Grid container spacing={2} sx={{ padding: "0px 40px" }}>
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

export default PatientNikshayDetails;
