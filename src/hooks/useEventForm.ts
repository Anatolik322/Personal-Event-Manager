import { useState } from "react";

import { toast } from "react-toastify";
import { Event } from "../types/Event.t";

interface UseEventFormProps {
	addEvent: (event: Omit<Event, "id">) => void;
	editEvent: (
		id: number,
		updatedEvent: Omit<Event, "id">
	) => void;
	editingEventId: number | null;
	setEditingEventId: (id: number | null) => void;
}

export const useEventForm = ({
	addEvent,
	editEvent,
	editingEventId,
	setEditingEventId,
}: UseEventFormProps) => {
	const [newEvent, setNewEvent] = useState<
		Omit<Event, "id">
	>({
		name: "",
		date: "",
		category: "work",
		status: "upcoming",
	});

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

	return { newEvent, setNewEvent, handleAddOrEditEvent };
};
