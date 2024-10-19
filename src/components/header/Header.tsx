import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function Header() {
	return (
		<Box
			sx={{ flexGrow: 1, backgroundColor: "#485a64" }}
		>
			<AppBar
				position="static"
				sx={{ backgroundColor: "#485a64" }}
			>
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						Personal Event Manager
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default Header;
