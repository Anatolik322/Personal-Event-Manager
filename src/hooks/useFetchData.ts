import { useState, useEffect } from "react";
import axios from "axios";

export const useFetchData = <T>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get<T>(url);
				setData(response.data);
			} catch (err) {
				setError(
					"An error occurred while fetching data."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading, error };
};
