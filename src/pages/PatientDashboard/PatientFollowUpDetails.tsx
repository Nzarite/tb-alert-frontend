import {
	Chip,
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
import { FollowUpsDataInterface } from "../../components/datatypes/DataTypes";
import { getStatusColor, getStatusName } from "../FollowUp/FollowUpSidebar";

const PatientFollowUpDetails = (patientId:any) => {
	const [patientData, setPatientData] = useState(null);

	useEffect(() => {
		const getData = async () => {
			const res = await axiosInstance.get(`followup/${patientId.patientId}`);
			setPatientData(res.data.followUpDetails);
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
								<Typography sx={{ fontWeight: "bold" }}>Follow Up</Typography>
							</TableCell>
							<TableCell sx={{ backgroundColor: "#ebebeb" }}>
								<Typography sx={{ fontWeight: "bold" }}>Date</Typography>
							</TableCell>
							<TableCell sx={{ backgroundColor: "#ebebeb" }}>
								<Typography sx={{ fontWeight: "bold" }}>Status</Typography>
							</TableCell>
							<TableCell sx={{ backgroundColor: "#ebebeb" }}>
								<Typography sx={{ fontWeight: "bold" }}>Review</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{patientData && patientData.length > 0 ? (
							patientData.map((followup: FollowUpsDataInterface, index: number) => (
								<TableRow key={index}>
									<TableCell>
										<Typography>Follow up {index + 1}</Typography>
									</TableCell>
									<TableCell>
										<Typography>{followup.date}</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={getStatusName(
												followup.date,
												followup.followUpStatus
											)}
											color={getStatusColor(
												followup.date,
												followup.followUpStatus
											)}
											variant="outlined"
											size="small"
										/>
									</TableCell>
									<TableCell>
										<Typography>{followup.patientCondition}</Typography>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} align="center">
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

export default PatientFollowUpDetails;
