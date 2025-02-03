import { TextField } from "@mui/material";
import { useState } from "react";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchTerm(query);
		onSearch(query);
	};

	return (
		<TextField
			size="small"
			fullWidth
			value={searchTerm}
			onChange={handleSearchChange}
			placeholder="Search Patients"
		/>
	);
};

export default SearchBar;
