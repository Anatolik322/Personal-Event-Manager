export interface Event {
	id: number;
	name: string;
	date: string;
	category: "work" | "personal" | "other";
	status: "upcoming" | "completed";
}
