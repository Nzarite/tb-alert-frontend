import { useEffect, useState } from "react";
import Select from "react-select";

interface SearchProps {
	changeSearch: (text: { value: string; label: string }) => void;
}

const SearchBox = ({ changeSearch }: SearchProps) => {
	const [inputValue, setInputValue] = useState("");
	const [lastSearched, setLastSearched] = useState("");
	const [options, setOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(
		null
	);

	// This method fetches options for the drop down menu
	const fetchOptions = async (search: string) => {
		if (!search) {
			setOptions([]);
			setLastSearched("");
			return;
		}
		if (search === lastSearched) return; // Prevent duplicate fetches
		// try {
		// 	const response = await axiosInstance.get(`/employees/employee/name/${search}`);
		// 	const data = response.data.content.map((item) => ({
		// 		value: item.eid,
		// 		label: `${item.firstname} ${item.lastname} (${item.eid})`,
		// 	}));
		// 	setOptions(data);
		// 	setLastSearched(search);
		// } catch (error) {
		// 	console.error("Error fetching options:", error);
		// }
	};

	// Debouncing the Search for optimisation
	useEffect(() => {
		const debounceSearch = setTimeout(() => {
			fetchOptions(inputValue.trim());
		}, 300);

		return () => {
			clearTimeout(debounceSearch);
		};
	}, [inputValue]);

	// This method updates the search for all the 
	useEffect(() => {
		if (selectedOption) changeSearch(selectedOption);
	}, [selectedOption]);

	return (
		<Select
			isClearable
			value={selectedOption}
			onChange={(value) => {
				setSelectedOption(value);
				setInputValue(value?.label || ""); // Set the input value based on selection
			}}
			onInputChange={(newValue) => setInputValue(newValue)}
			options={options}
			placeholder="Search Patient..."
		/>
	);
};

export default SearchBox;
