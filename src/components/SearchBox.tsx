import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import axiosInstance from "./axiosInstance";
import { PatientInterface } from "./datatypes/DataTypes";
import { useAuth } from "react-oidc-context";

interface SearchProps {
  changeSearch: (text: { value: string; label: string }) => void;
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
        const data = response.data.map((item: PatientInterface) => ({
          value: item.patientId,
          label: `${item.firstName} ${item.lastName}`,
          details: `${item.patientId} | ${item.age} yrs | ${item.gender}`,
        }));
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

    return () => {
      clearTimeout(debounceSearch);
    };
  }, [inputValue, lastSearched]);

  // Update search selection
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
        <div style={{ fontSize: "12px", color: "#666" }}>{data.details}</div>
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
          placeholder="Search Patient..."
          components={{ Option: CustomOption }}
          styles={customStyles}
        />
        {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
      </>
  );
};

export default SearchBox;
