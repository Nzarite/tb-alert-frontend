import { AppBar, Toolbar, Typography } from "@mui/material";
import "./Navbar.css";

const Navbar = () => {
	return (
		<AppBar position="static">
			<Toolbar variant="dense">
				<Typography variant="h6" color="inherit" component="div">
					TB Alert
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
