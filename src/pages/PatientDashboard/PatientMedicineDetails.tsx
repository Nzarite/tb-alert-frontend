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
import patientData from "../../components/Json/PatientMedicineDetails.json";

const PatientMedicineDetails = () => {
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
										<Typography>{medicine.medicationName}</Typography>
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
