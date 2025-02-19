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
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debouncing the Search for optimisation
  useEffect(() => {
    // This method fetches options for the drop down menu
    const fetchOptions = async (search: string) => {
      if (!search) {
        setOptions([]);
        setLastSearched("");
        return;
      }
      if (search === lastSearched) return; // Prevent duplicate fetches
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/patient/name/${search}`);
        const data = response.data.map((item: patientSearch) => ({
          value: item.patientId,
          label: `${item.firstName} ${item.lastName}`,
        }));
        setOptions(data);
        setLastSearched(search);
      } catch (error: any) {
        console.error("Error fetching options:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch patient data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    const debounceSearch = setTimeout(() => {
      fetchOptions(inputValue.trim());
    }, 300);

    return () => {
      clearTimeout(debounceSearch);
    };
  }, [inputValue, lastSearched]);

  // This method updates the search for all the
  useEffect(() => {
    if (selectedOption) changeSearch(selectedOption);
  }, [changeSearch, selectedOption]);

  return (
    <div>
      <Select
        isClearable
        isLoading={loading}
        value={selectedOption}
        onChange={(value) => {
          setSelectedOption(value);
          setInputValue(value?.label || ""); // Set the input value based on selection
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        options={options}
        placeholder="Search Patient..."
      />
      {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
    </div>
  );
};

export default SearchBox;
