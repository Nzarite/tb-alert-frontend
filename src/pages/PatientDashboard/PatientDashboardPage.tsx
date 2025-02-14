import { Box, Grid, Paper, Typography } from "@mui/material";
import {
	MdAssessment,
	MdLocalHospital,
	MdMobileFriendly,
	MdPerson,
	MdVaccines,
} from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import PatientContactScreeningDetails from "./PatientContactScreeningDetails";
import PatientFollowUpDetails from "./PatientFollowUpDetails";
import PatientMedicalDetails from "./PatientMedicalDetails";
import PatientMedicineDetails from "./PatientMedicineDetails";
import PatientNikshayDetails from "./PatientNikshayDetails";
import PatientPersonalDetails from "./PatientPersonalDetails";

const PatientDashboardPage = () => {
	const navigate = useNavigate();
	return (
		<Grid container spacing={2} sx={{ p: 2 }}>
			{[
				{
					title: "Personal Details",
					component: <PatientPersonalDetails />,
					icon: <MdPerson style={{ fontSize: "24px" }} />,
					size: 6,
					editURL: "/register/patient",
					prop: 0,
				},
				{
					title: "Nikshay Details",
					component: <PatientNikshayDetails />,
					icon: <MdMobileFriendly style={{ fontSize: "20px" }} />,
					size: 6,
					editURL: "/register/patient",
					prop: 1,
				},
				{
					title: "Medical Report",
					component: <PatientMedicalDetails />,
					icon: <MdLocalHospital style={{ fontSize: "25px" }} />,
					size: 6,
					editURL: "/register/patient",
					prop: 0,
				},
				{
					title: "Medicines",
					component: <PatientMedicineDetails />,
					icon: <MdVaccines style={{ fontSize: "20px" }} />,
					size: 6,
					editURL: "",
				},
				{
					title: "Contact Screening",
					component: <PatientContactScreeningDetails />,
					icon: <MdAssessment style={{ fontSize: "22px" }} />,
					size: 6,
					editURL: "/register/patient",
					prop: 2,
				},
				{
					title: "Follow Up",
					component: <PatientFollowUpDetails />,
					icon: <MdAssessment style={{ fontSize: "22px" }} />,
					size: 6,
					editURL: "/visit",
					prop: 1,
				},
			].map((section, index) => (
				<Grid item xs={12} sm={section.size} key={index}>
					<Paper
						sx={{
							p: 3,
							height: "100%",
							overflowY: "auto",
						}}>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<Box sx={{ display: "flex", gap: 1 }}>
								{section.icon}
								<Typography
									variant="h6"
									fontWeight="bold"
									sx={{ mb: 2, color: "#1976d2" }}>
									{section.title}
								</Typography>
							</Box>
							<RiPencilLine
								style={{ fontSize: "20px" }}
								onClick={() =>
									navigate(section.editURL, {
										state: { prop: section.prop },
									})
								}
							/>
						</Box>
						{section.component}
					</Paper>
				</Grid>
			))}
		</Grid>
	);
};

export default PatientDashboardPage;
