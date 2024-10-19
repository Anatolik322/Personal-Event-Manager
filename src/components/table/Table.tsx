import React, { useState, useEffect } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import Popup from "../popup/Popup";

interface Event {
	id: number;
	name: string;
	date: string;
	category: "work" | "personal" | "other";
	status: "upcoming" | "completed";
}

const EventManager: React.FC = () => {
	const {
		events,
		addEvent,
		editEvent,
		deleteEvent,
		toggleComplete,
	} = useEventStore();

	const [filteredEvents, setFilteredEvents] =
		useState<Event[]>(events);
	const [newEvent, setNewEvent] = useState<
		Omit<Event, "id">
	>({
		name: "",
		date: "",
		category: "work",
		status: "upcoming",
	});
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

	useEffect(() => {
		applyFilterAndSort();
	}, [events, sortField, filterCategory]);

	const applyFilterAndSort = () => {
		let filtered = events;

		if (filterCategory !== "all") {
			filtered = filtered.filter(
				(event) => event.category === filterCategory
			);
		}

		filtered = filtered.sort((a, b) => {
			if (a[sortField] > b[sortField]) return 1;
			if (a[sortField] < b[sortField]) return -1;
			return 0;
		});

		setFilteredEvents(filtered);
	};

	const handleAddOrEditEvent = () => {
		const selectedDate = new Date(newEvent.date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (!newEvent.name || !newEvent.date) {
			toast.error("Please fill in all fields!", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			return;
		}

		if (selectedDate < today) {
			toast.error(
				"Please select a date that is today or in the future.",
				{
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				}
			);

			return;
		}

		if (editingEventId !== null) {
			editEvent(editingEventId, newEvent);
			setEditingEventId(null);
		} else {
			addEvent(newEvent);
		}

		setNewEvent({
			name: "",
			date: "",
			category: "work",
			status: "upcoming",
		});
	};

	const handleEditClick = (event: Event) => {
		setEditingEventId(event.id);
		setNewEvent({
			name: event.name,
			date: event.date,
			category: event.category,
			status: event.status,
		});
	};

	const startIndex = (currentPage - 1) * eventsPerPage;
	const endIndex = startIndex + eventsPerPage;
	const currentEvents = filteredEvents.slice(
		startIndex,
		endIndex
	);

	return (
		<div className="mt-5 mx-auto w-10/12">
			<Popup
				open={isOpen}
				handleClose={() => {
					setIsOpen(false);
				}}
				data={popupData}
			/>
			<div className="flex flex-row gap-5 my-3">
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
					sx={{
						bgcolor: "#485A64",
					}}
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

			<Table className="border w-9/12 rounded-sm mt-10">
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
								/>
								<Button
									onClick={() =>
										handleEditClick(
											event
										)
									}
								>
									<img
										className="w-8"
										src="/images/pencil.png"
									/>
								</Button>
								<Button
									onClick={() =>
										deleteEvent(
											event.id
										)
									}
								>
									<img
										className="w-8"
										src="/images/bin.png"
									/>
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

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
