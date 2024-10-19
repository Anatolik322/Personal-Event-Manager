import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

export default function Popup({
	open,
	handleClose,
	data,
}: {
	open: boolean;
	handleClose: () => void;
	data: any;
}) {
	return (
		<React.Fragment>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Event Details"}
				</DialogTitle>
				<DialogContent>
					<Typography variant="h6">
						Event Name: {data?.name}
					</Typography>
					<Typography variant="body1">
						Category: {data?.category}
					</Typography>
					<Typography variant="body1">
						Date: {data?.date}
					</Typography>
					<Typography variant="body1">
						Status: {data?.status}
					</Typography>
					<Typography variant="body1">
						ID: {data?.id}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
