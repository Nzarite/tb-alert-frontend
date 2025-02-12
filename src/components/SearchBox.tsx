import { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "./axiosInstance";
import { useAuth } from "react-oidc-context";

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

  const auth = useAuth();
  const access_token = auth.user?.access_token || "";

  //   console.log(access_token);

  // const profile = auth.user?.profile || {};
  // const hasClientRole = profile?.client_roles?.includes("Telecaller");

  //   console.log(hasClientRole);
  //   console.log(profile?.client_roles);

  // This method fetches options for the drop down menu
  useEffect(() => {
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
