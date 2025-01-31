import { Grid2 } from "@mui/material";
import { useState } from "react";
import FollowUpFormComponent from "./FollowUpFormComponent";
import FollowUpSidebar from "./FollowUpSidebar";
import "./VisitFollowUpPage.css";

const VisitFollowUpPage = () => {
	const [noOfFollowUps] = useState(3);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleListItemClick = (index: number) => {
		setSelectedIndex(index);
	};

	return (
		<Grid2 container>
			<Grid2 size={2}>
				<FollowUpSidebar
					noOfFollowUps={noOfFollowUps}
					selectedIndex={selectedIndex}
					setIndex={handleListItemClick}
				/>
			</Grid2>
			<Grid2 size={10}>
				<div style={{ maxHeight: "92vh", overflow: "scroll", overflowX: "hidden" }}>
					<FollowUpFormComponent index={selectedIndex + 1} />
				</div>
			</Grid2>
		</Grid2>
	);
};

export default VisitFollowUpPage;
