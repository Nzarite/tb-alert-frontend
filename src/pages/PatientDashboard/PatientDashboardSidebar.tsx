import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { selectionListDataTypes } from "./PatientDashboardPage";

interface PatientDashboardSidebarProps {
	selectionList: selectionListDataTypes[];
	selectionIndex: number;
	changeSelection: (index: number) => void;
}

const PatientDashboardSidebar = ({
	selectionList,
	selectionIndex,
	changeSelection,
}: PatientDashboardSidebarProps) => {
	return (
		<>
			<ListItemText
				sx={{ marginBottom: 2 }}
				primary="Dashboard"
				primaryTypographyProps={{
					fontSize: 20,
					fontWeight: "medium",
					letterSpacing: 0,
				}}
			/>
			<Divider />
			<List component="nav">
				{selectionList.map((item, index) => (
					<ListItemButton
						key={index}
						disableRipple
						selected={selectionIndex === index}
						onClick={() => changeSelection(index)}>
						<ListItemIcon>{item.icon}</ListItemIcon>
						<ListItemText primary={item.name} />
					</ListItemButton>
				))}
			</List>
		</>
	);
};

export default PatientDashboardSidebar;
