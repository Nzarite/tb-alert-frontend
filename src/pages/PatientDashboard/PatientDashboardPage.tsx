import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import { MdLocalHospital, MdMobileFriendly, MdPerson, MdVaccines } from "react-icons/md";
import PatientDashboardMain from "./PatientDashboardMain";
import PatientDashboardSidebar from "./PatientDashboardSidebar";

export interface selectionListDataTypes {
	name: string;
	icon: React.ReactNode;
}

const sidebarSelectionModes = [
	{ name: "Personal Records", icon: <MdPerson /> },
	{ name: "Medical Records", icon: <MdLocalHospital /> },
	{ name: "Nikshay Details", icon: <MdMobileFriendly /> },
	{ name: "Medications", icon: <MdVaccines /> },
];

const PatientDashboardPage = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<Grid container padding={1}>
			<Grid item lg={3} sx={{ height: "84vh", padding: 1 }}>
				<Paper sx={{ padding: 2 }}>
					<PatientDashboardSidebar
						selectionList={sidebarSelectionModes}
						selectionIndex={selectedIndex}
						changeSelection={(input) => setSelectedIndex(input)}
					/>
				</Paper>
			</Grid>
			<Grid item lg={9} sx={{ height: "84vh", padding: 1 }}>
				<Paper sx={{ height: "100%", padding: 2, overflow: "auto" }}>
					<PatientDashboardMain
						selectionList={sidebarSelectionModes}
						selectionIndex={selectedIndex}
					/>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default PatientDashboardPage;
