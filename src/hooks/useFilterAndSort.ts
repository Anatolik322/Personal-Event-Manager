import { useEffect, useState } from "react";
import { Event } from "../types/Event.t";

export const useFilterAndSort = (
	events: Event[],
	sortField: keyof Event,
	filterCategory: string
) => {
	const [filteredEvents, setFilteredEvents] =
		useState<Event[]>(events);

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

	return filteredEvents;
};
