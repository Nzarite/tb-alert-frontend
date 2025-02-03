import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import VisitData from "../../components/Json/visit.json";
import { VisitDataInterface } from "../../components/VisitDataTypes";
import FollowUpFormComponent from "./FollowUpFormComponent";
import FollowUpSidebar from "./FollowUpSidebar";
import SearchBar from "../../components/SearchBar";

const VisitFollowUpPage = () => {
	const [data, setData] = useState<VisitDataInterface>(VisitData);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleListItemClick = (index: number) => {
		if (index >= 0 && index < data.followUps.length) setSelectedIndex(index);
	};

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				py: { xs: 1, sm: 2, md: 3 },
			}}>
			<Container maxWidth="xl">
				<Grid container spacing={{ xs: 2, md: 3 }}>
					<Grid item xs={12} md={3}>
						<SearchBar />
						{/* Sidebar */}
						<Paper
							variant="outlined"
							sx={{
								padding: 2,
								position: "sticky",
								top: 16,
								marginTop: 1,
							}}>
							<FollowUpSidebar
								selectedIndex={selectedIndex}
								setIndex={handleListItemClick}
								data={data.followUps}
							/>
						</Paper>
					</Grid>

					{/* Main Content */}
					<Grid item xs={12} md={9}>
						<Typography variant="h5" sx={{ marginBottom: 2 }}>
							Patient Name: {data.patient.firstname} {data.patient.lastname}
						</Typography>
						<FollowUpFormComponent
							index={selectedIndex + 1}
							data={data.followUps[selectedIndex]}
						/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default VisitFollowUpPage;
