import { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "./axiosInstance";
import { TeleCaller, StateHead } from "./datatypes/DataTypes";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleToUrlMap: Record<SearchProps["role"], string> = {
    patient: "/patient/name/",
    telecaller: "/telecaller/name/",
    statehead: "/statehead/name/",
  };

  const url = roleToUrlMap[role];

  // Debouncing the Search for optimisation
  useEffect(() => {
    const fetchOptions = async (search: string) => {
      if (!search || search === lastSearched) return;

      try {
        const response = await axiosInstance.get(url + search);
        let data;
        if (role === "patient") {
          data = response.data.map((item: Patient) => ({
            value: item.patientId,
            label: `${item.firstName} ${item.lastName}`,
            details: `${item.patientId} | ${item.age} yrs | ${item.gender} | ${item.state}`,
          }));
        } else if (role === "telecaller") {
          data = response.data.map((item: TeleCaller) => ({
            value: item.teleCallerId.toString(),
            label: `${item.firstName} ${item.lastName}`,
            details: `${item.gender} | ${item.state}`,
          }));
        } else if (role === "statehead") {
          data = response.data.map((item: StateHead) => ({
            value: item.stateHeadId.toString(),
            label: `${item.firstName} ${item.lastName}`,
            details: `${item.gender} | ${item.state}`,
          }));
        }
        setOptions(data);
        setLastSearched(search);
      } catch (error: any) {
        console.error("Error fetching options:", error);
        setError(
          error.response?.data ||
            "Failed to fetch patient data. Please try again."
        );
      } finally {
        setLoading(false);
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

  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    const [hover, setHover] = useState(false);

    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          padding: "12px 15px",
          cursor: "pointer",
          borderBottom: "1px solid #ddd",
          marginBottom: 0,
          backgroundColor: hover ? "#e8f1f6" : "white",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <strong>{data.label}</strong>
        <div style={{ fontSize: "12px", color: "#666", marginTop: 2 }}>
          {data.details}
        </div>
      </div>
    );
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      textAlign: "center",
    }),
    option: (provided: any, { isFocused }: { isFocused: boolean }) => ({
      ...provided,
      backgroundColor: isFocused ? "black" : "white",
      color: "black",
      cursor: "pointer",
      textAlign: "center",
    }),
  };

  return (
    <>
      <Select
        isClearable
        isLoading={loading}
        value={selectedOption}
        onChange={(value) => {
          setSelectedOption(value);
          setInputValue(value?.label || "");
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        options={options}
        filterOption={() => true}
        components={{ Option: CustomOption }}
        styles={customStyles}
        placeholder={`Search ${
          role === "patient"
            ? "Patients"
            : role === "telecaller"
            ? "Telecallers"
            : "State heads"
        } ...`}
      />
      {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
    </>
  );
};

export default SearchBox;
