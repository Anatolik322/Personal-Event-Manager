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
		if (editingEventId !== null) {
			editEvent(editingEventId, newEvent);
			setEditingEventId(null);
		} else {
			if (newEvent.name && newEvent.date) {
				addEvent(newEvent);
			}
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

	return (
		<div className=" mt-5 mx-auto w-10/12">
			<div className=" flex flex-row gap-5 my-3">
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
					// label="Event Date"
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
			<div className=" flex flex-row gap-5">
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

			<Table className=" border w-9/12 rounded-sm mt-10">
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
					{filteredEvents.map((event) => (
						<TableRow key={event.id}>
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
				count={Math.ceil(filteredEvents.length / 5)}
				page={1}
				onChange={() => {}}
			/>
		</div>
	);
};

export default EventManager;
