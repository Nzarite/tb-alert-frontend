import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import VisitData from "../../components/Json/visit.json";
import { VisitDataInterface } from "../../components/VisitDataTypes";
import FollowUpFormComponent from "./FollowUpFormComponent";
import FollowUpSidebar from "./FollowUpSidebar";
import SearchBox from "../../components/SearchBox";

const VisitFollowUpPage = () => {
	const [data, setData] = useState<VisitDataInterface | null>(VisitData);
	const [search, setSearch] = useState<string | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(() => {
		const today = Date.now();

		let index = 0;
		if (data?.followUps.length) {
			let fud = Date.parse(data.followUps[0].date);

			for (let i = 0; i < data?.followUps.length; i++) {
				const followUpDate = Date.parse(data.followUps[i].date);
				if (followUpDate < today && followUpDate > fud) {
					fud = followUpDate;
					index = i;
				}
			}
		}
		return index;
	});

	const handleListItemClick = (index: number) => {
		if (data && index >= 0 && index < data?.followUps.length) setSelectedIndex(index);
	};

	const getPatientData = (search: string) => {
		setData(VisitData);
	};

	useEffect(() => {
		if (search) getPatientData(search);
	}, [search]);

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				py: { xs: 1, sm: 2, md: 3 },
			}}>
			<Container maxWidth="xl">
				<Grid container spacing={{ xs: 2, md: 3 }}>
					<Grid item xs={12} md={3}>
						{/* Search Bar */}
						<SearchBox changeSearch={(input) => setSearch(input)} />

						{/* Sidebar */}
						<Paper
							variant="outlined"
							sx={{
								padding: 2,
								position: "sticky",
								top: 16,
								marginTop: 1,
							}}>
							{data && data.followUps.length > 0 && (
								<FollowUpSidebar
									selectedIndex={selectedIndex}
									setIndex={handleListItemClick}
									data={data.followUps}
								/>
							)}
						</Paper>
					</Grid>

					{/* Main Content */}
					<Grid item xs={12} md={9}>
						{data && (
							<Typography variant="h5" sx={{ marginTop: 1, marginBottom: 1 }}>
								Patient Name: {data.patient.firstname} {data.patient.lastname}
							</Typography>
						)}

						<FollowUpFormComponent
							index={selectedIndex + 1}
							data={data && data.followUps[selectedIndex]}
						/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default VisitFollowUpPage;
