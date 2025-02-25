import { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "./axiosInstance";
import { useAuth } from "react-oidc-context";
import { TeleCaller,StateHead } from "./datatypes/DataTypes";
import { Box } from "@mui/material";

interface SearchProps {
  changeSearch: (text: { value: string; label: string }) => void;
  role: "patient" | "telecaller" | "statehead";
}

interface Patient {
  patientId: number;
  firstName: string;
  lastName: string;
}


const SearchBox = ({ changeSearch, role }: SearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [lastSearched, setLastSearched] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const auth = useAuth();
  const access_token = auth.user?.access_token || "";

  const roleToUrlMap: Record<SearchProps["role"], string> = {
    patient: "/patient/name/",
    telecaller: "/telecaller/name/",
    statehead: "/statehead/name/",
  };

  const url = roleToUrlMap[role];

  useEffect(() => {
    const fetchOptions = async (search: string) => {
      if (!search || search === lastSearched) return;

      try {
        const response = await axiosInstance.get(url + search, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        console.log(response.data);
        let data;
        if (role === "patient") {
          data = response.data.map((item: Patient) => ({
            value: item.patientId,
            label: `${item.firstName} ${item.lastName}`,
          }));
        } else if (role === "telecaller") {
          data = response.data.map((item: TeleCaller) => ({
            value: item.teleCallerId.toString(),
            label: `${item.firstName} ${item.lastName}`,

          }));
        } else if (role === "statehead") {
          data = response.data.map((item: StateHead) => ({
            value: item.stateHeadId.toString(),
            label: `${item.firstName} ${item.lastName}`,
          }));
        }
        console.log(data);
        setOptions(data);
        setLastSearched(search);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    const debounceSearch = setTimeout(() => {
      fetchOptions(inputValue.trim());
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [inputValue, lastSearched, role]);

  useEffect(() => {
    if (selectedOption) changeSearch(selectedOption);
  }, [changeSearch, selectedOption]);

  return (
    <Box>
    <Select
      isClearable
      value={selectedOption}
      onChange={(value) => {
        setSelectedOption(value);
        setInputValue(value?.label || "");
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      options={options}
      placeholder={
        role === "patient"
          ? "Search Patients..."
          : role === "telecaller"
          ? "Search Telecallers..."
          : "Search State Coordinators..."
      }
    />
    </Box>
  );
};

export default SearchBox;
