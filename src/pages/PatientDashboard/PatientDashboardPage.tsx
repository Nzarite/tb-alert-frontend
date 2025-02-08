import { Box, Grid, Paper, Typography } from "@mui/material";
import { MdLocalHospital, MdMobileFriendly, MdPerson, MdVaccines } from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import PatientMedicalDetails from "./PatientMedicalDetails";
import PatientMedicineDetails from "./PatientMedicineDetails";
import PatientNikshayDetails from "./PatientNikshayDetails";
import PatientPersonalDetails from "./PatientPersonalDetails";

const PatientDashboardPage = () => {
	return (
		<Grid container spacing={2} sx={{ p: 2 }}>
			{[
				{
					title: "Personal Details",
					component: <PatientPersonalDetails />,
					icon: <MdPerson style={{ fontSize: "25px" }} />,
				},
				{
					title: "Nikshay Details",
					component: <PatientNikshayDetails />,
					icon: <MdMobileFriendly style={{ fontSize: "20px" }} />,
				},
				{
					title: "Medicines",
					component: <PatientMedicineDetails />,
					icon: <MdVaccines style={{ fontSize: "20px" }} />,
				},
				{
					title: "Medical Report",
					component: <PatientMedicalDetails />,
					icon: <MdLocalHospital style={{ fontSize: "25px" }} />,
				},
			].map((section, index) => (
				<Grid item xs={12} sm={6} key={index}>
					<Paper
						sx={{
							p: 3,
							borderRadius: 3,
							height: "100%",
							backgroundColor: "#fdfdfd",
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
							<RiPencilLine style={{ fontSize: "20px" }} />
						</Box>
						{section.component}
					</Paper>
				</Grid>
			))}
		</Grid>
	);
};

export default PatientDashboardPage;
