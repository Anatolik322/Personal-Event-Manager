import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	TextField,
	Select,
	MenuItem,
	Typography,
	Checkbox,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useEventStore } from "../../store/store";
import { ToastContainer } from "react-toastify";
import Popup from "../popup/Popup";
import { useFilterAndSort } from "../../hooks/useFilterAndSort";
import { useEventForm } from "../../hooks/useEventForm";
import { Event } from "../../types/Event.t";

const EventManager: React.FC = () => {
	const {
		events,
		addEvent,
		editEvent,
		deleteEvent,
		toggleComplete,
	} = useEventStore();

	const [editingEventId, setEditingEventId] = useState<
		number | null
	>(null);
	const [sortField, setSortField] =
		useState<keyof Event>("name");
	const [filterCategory, setFilterCategory] =
		useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	const [popupData, setPopupData] = useState({});

	const eventsPerPage = 5;
	const filteredEvents = useFilterAndSort(
		events,
		sortField,
		filterCategory
	);
	const { newEvent, setNewEvent, handleAddOrEditEvent } =
		useEventForm({
			addEvent,
			editEvent,
			editingEventId,
			setEditingEventId,
		});

	const startIndex = (currentPage - 1) * eventsPerPage;
	const endIndex = startIndex + eventsPerPage;
	const currentEvents = filteredEvents.slice(
		startIndex,
		endIndex
	);

	const handleEditClick = (event: Event) => {
		setNewEvent({
			name: event.name,
			date: event.date,
			category: event.category,
			status: event.status,
		});
		setEditingEventId(event.id);
	};

	return (
		<div className="mt-5 mx-auto w-11/12 ">
			<Popup
				open={isOpen}
				handleClose={() => setIsOpen(false)}
				data={popupData}
			/>

			<div className="flex flex-row gap-5 my-3 flex-wrap">
				<TextField
					label="Event Name"
					value={newEvent.name}
					onChange={(e) =>
						setNewEvent({
							...newEvent,
							name: e.target.value,
						})
					}
				/>
				<TextField
					type="date"
					value={newEvent.date}
					onChange={(e) =>
						setNewEvent({
							...newEvent,
							date: e.target.value,
						})
					}
				/>
				<Select
					value={newEvent.category}
					onChange={(e) =>
						setNewEvent({
							...newEvent,
							category: e.target
								.value as Event["category"],
						})
					}
				>
					<MenuItem value="work">Work</MenuItem>
					<MenuItem value="personal">
						Personal
					</MenuItem>
					<MenuItem value="other">Other</MenuItem>
				</Select>
				<Button
					variant="contained"
					sx={{ bgcolor: "#485A64" }}
					onClick={handleAddOrEditEvent}
				>
					{editingEventId !== null
						? "Edit Event"
						: "Add Event"}
				</Button>
			</div>

			<Typography>Sort by:</Typography>
			<div className="flex flex-row gap-5">
				<Select
					value={filterCategory}
					onChange={(e) =>
						setFilterCategory(e.target.value)
					}
				>
					<MenuItem value="all">
						All Categories
					</MenuItem>
					<MenuItem value="work">Work</MenuItem>
					<MenuItem value="personal">
						Personal
					</MenuItem>
					<MenuItem value="other">Other</MenuItem>
				</Select>
				<Select
					value={sortField}
					onChange={(e) =>
						setSortField(
							e.target.value as keyof Event
						)
					}
				>
					<MenuItem value="name">
						Sort by Name
					</MenuItem>
					<MenuItem value="date">
						Sort by Date
					</MenuItem>
					<MenuItem value="category">
						Sort by Category
					</MenuItem>
				</Select>
			</div>

			<div className="overflow-x-auto">
				<Table className="border rounded-sm mt-10 w-full sm:w-[350px]">
					<TableHead
						sx={{
							bgcolor: "#485A64",
							color: "#f2f2f2",
						}}
					>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{currentEvents.map((event) => (
							<TableRow
								key={event.id}
								onClick={() => {
									setPopupData(event);
									setIsOpen(true);
								}}
							>
								<TableCell>
									{event.name}
								</TableCell>
								<TableCell>
									{event.date}
								</TableCell>
								<TableCell>
									{event.category}
								</TableCell>
								<TableCell>
									{event.status}
								</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										<Checkbox
											checked={
												event.status ===
												"completed"
											}
											onChange={() =>
												toggleComplete(
													event.id
												)
											}
											onClick={(e) =>
												e.stopPropagation()
											}
										/>
										<Button
											sx={{
												width: "24px",
											}}
											onClick={(
												e
											) => {
												e.stopPropagation();
												handleEditClick(
													event
												);
											}}
										>
											<img
												src="/images/pencil.png"
												alt="pencil"
												className="w-6 cursor-pointer"
											/>
										</Button>
										<Button
											sx={{
												width: "24px",
											}}
											onClick={(
												e
											) => {
												e.stopPropagation();
												deleteEvent(
													event.id
												);
											}}
										>
											<img
												src="/images/bin.png"
												alt="bin"
												className="w-6 cursor-pointer"
											/>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<Pagination
				count={Math.ceil(
					filteredEvents.length / eventsPerPage
				)}
				page={currentPage}
				onChange={(event, value) =>
					setCurrentPage(value)
				}
			/>
			<ToastContainer />
		</div>
	);
};

export default EventManager;
