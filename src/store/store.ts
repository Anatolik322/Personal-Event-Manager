import { create } from "zustand";
import { persist } from "zustand/middleware"; // Import the persist middleware
import { Event } from "../types/Event.t";

interface EventStore {
	events: Event[];
	addEvent: (event: Omit<Event, "id">) => void;
	editEvent: (
		id: number,
		updatedEvent: Partial<Event>
	) => void;
	deleteEvent: (id: number) => void;
	toggleComplete: (id: number) => void;
}

// Use the persist middleware and provide the correct types
export const useEventStore = create<EventStore>()(
	persist(
		(set) => ({
			events: [
				{
					id: 1,
					name: "Meeting",
					date: "2024-10-10",
					category: "work",
					status: "upcoming",
				},
				{
					id: 2,
					name: "Birthday Party",
					date: "2024-10-11",
					category: "personal",
					status: "upcoming",
				},
			],

			addEvent: (event) =>
				set((state) => ({
					events: [
						...state.events,
						{ ...event, id: Date.now() },
					],
				})),

			editEvent: (id, updatedEvent) =>
				set((state) => ({
					events: state.events.map((event) =>
						event.id === id
							? { ...event, ...updatedEvent }
							: event
					),
				})),

			deleteEvent: (id) =>
				set((state) => ({
					events: state.events.filter(
						(event) => event.id !== id
					),
				})),

			toggleComplete: (id) =>
				set((state) => ({
					events: state.events.map((event) =>
						event.id === id
							? {
									...event,
									status:
										event.status ===
										"completed"
											? "upcoming"
											: "completed",
							  }
							: event
					),
				})),
		}),
		{
			name: "event-store",
			//@ts-ignore
			getStorage: () => localStorage,
		}
	)
);
