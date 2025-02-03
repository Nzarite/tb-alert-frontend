import { AppBar, Toolbar, Typography } from "@mui/material";

const Navbar = () => {
	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx={{
				backgroundColor: "primary.main",
				borderRadius: "0",
			}}>
			<Toolbar
				variant="dense"
				sx={{
					minHeight: 50,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Typography
					variant="h6"
					component="div"
					sx={{
						fontWeight: 600,
						letterSpacing: "0.5px",
						fontSize: 20,
					}}>
					TB Alert
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
