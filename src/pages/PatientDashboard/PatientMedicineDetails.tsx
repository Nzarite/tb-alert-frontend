import {
	Divider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";

const PatientMedicineDetails = () => {
	const [patientData, setPatientData] = useState(null);

	useEffect(() => {
		const id = 1;
		const getData = async () => {
			const res = await axiosInstance.get(`patientmedication/${id}`);
			setPatientData(res.data);
		};

		getData();
	}, []);

	return (
		<>
			<Divider sx={{ mb: 4 }} />

			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ backgroundColor: "#ebebeb" }}>
								<Typography sx={{ fontWeight: "bold" }}>Medication Name</Typography>
							</TableCell>
							<TableCell sx={{ backgroundColor: "#ebebeb" }}>
								<Typography sx={{ fontWeight: "bold" }}>Frequency</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{patientData && patientData.length > 0 ? (
							patientData.map((medicine, index) => (
								<TableRow key={index}>
									<TableCell>
										<Typography>{medicine.medication}</Typography>
									</TableCell>
									<TableCell>
										<Typography>{medicine.frequency}</Typography>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={3} align="center">
									<Typography variant="body2" color="textSecondary">
										No Medications Found
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default PatientMedicineDetails;
