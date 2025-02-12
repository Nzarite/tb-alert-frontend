import { Chip, Divider, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { VisitDataInterface } from "../../components/datatypes/DataTypes";
import FollowUpStatus from "../../components/Json/FollowUpStatus.json";

interface FollowUpSidebarProps {
	selectedIndex: number;
	setIndex: (index: number) => void;
	data: VisitDataInterface;
}

export const getStatusColor = (dateOfFollowUp: string, filled: boolean) => {
	const today = Date.now();
	const dof = Date.parse(dateOfFollowUp);

	if (today < dof) return "warning";
	return filled ? "success" : "error";
};

export const getStatusName = (dateOfFollowUp: string, filled: boolean) => {
	const today = Date.now();
	const dof = Date.parse(dateOfFollowUp);

	if (today < dof) return FollowUpStatus.Scheduled;
	return filled ? FollowUpStatus.Captured : FollowUpStatus.Missed;
};

export default function FollowUpSidebar({ selectedIndex, setIndex, data }: FollowUpSidebarProps) {
	const isEditable = (dateOfFollowUp: string) => {
		const today = Date.now();
		const dof = Date.parse(dateOfFollowUp);

		return today > dof;
	};

	return (
		<List component="nav" aria-label="follow-up options">
			<Typography variant="h6" sx={{ marginBottom: 2 }}>
				Patient: {data.patient.firstName} {data.patient.lastName}
			</Typography>
			<Divider sx={{ marginBottom: 2 }} />
			{data.followUpDetails.map((item, index) => (
				<ListItemButton
					key={index}
					selected={selectedIndex === index}
					onClick={() => setIndex(index)}
					sx={{
						backgroundColor: selectedIndex === index ? "primary" : "inherit",
						borderRadius: 1,
					}}
					disabled={!isEditable(item.date)}
					disableTouchRipple>
					<ListItemText primary={`Follow Up ${index + 1}`} secondary={item.date} />
					<Chip
						label={getStatusName(item.date, item.followUpStatus)}
						color={getStatusColor(item.date, item.followUpStatus)}
						variant="outlined"
						size="small"
					/>
				</ListItemButton>
			))}
		</List>
	);
}
