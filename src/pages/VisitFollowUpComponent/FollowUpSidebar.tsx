import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

interface FollowUpSidebarProps {
	noOfFollowUps: number;
	selectedIndex: number;
	setIndex: (index: number) => void;
}

export default function FollowUpSidebar({
	noOfFollowUps,
	selectedIndex,
	setIndex,
}: FollowUpSidebarProps) {
	return (
		<Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
			<List component="nav" aria-label="main mailbox folders">
				{Array.from({ length: noOfFollowUps }).map((_, index) => (
					<ListItemButton
						key={index}
						selected={selectedIndex === index}
						onClick={() => setIndex(index)}>
						<ListItemText primary={`Follow Up ${index + 1}`} />
					</ListItemButton>
				))}
			</List>
		</Box>
	);
}
