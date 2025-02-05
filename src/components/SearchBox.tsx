import { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "./axiosInstance";

interface SearchProps {
	changeSearch: (text: { value: string; label: string }) => void;
}

interface patientSearch {
	patientId: number;
	firstName: string;
	lastName: string;
	gender: string;
	dateOfBirth: string;
	phone: string;
	block: string;
	gp: string;
	village: string;
	district: string;
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
		try {
			const response = await axiosInstance.get(`/patient/name/${search}`);
			const data = response.data.map((item: patientSearch) => ({
				value: item.patientId,
				label: `${item.firstName} ${item.lastName}`,
			}));
			setOptions(data);
			setLastSearched(search);
		} catch (error) {
			console.error("Error fetching options:", error);
		}
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
