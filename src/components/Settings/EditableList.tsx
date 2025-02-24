import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Chip, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import axiosInstance from "../axiosInstance";

interface EditableListProps {
  keyName: string;
  value: string;
  type: string;
  onSave: (keyName: string, value: string, type: string) => void;
}

interface medicationProps {
  id: number;
  name: string;
  beforeMeal: boolean;
}

const EditableList = ({ keyName, value, type, onSave }: EditableListProps) => {
  const [list, setList] = useState(value.split(","));
  const [availableOptions, setAvailableOptions] = useState([]);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/medication/all")
      .then((res) => {
        const data = res.data;
        setAvailableOptions(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const selectableValues = availableOptions.filter(
    (item) => !list.includes(item)
  );

  const handleAddValue = (selectedValue: string) => {
    setList([...list, selectedValue]);
  };

  const handleRemoveValue = (removeValue: string) => {
    setList(list.filter((item) => item !== removeValue));
  };

  const handleAddCustomValue = () => {
    if (!list.includes(newValue)) {
      setList([...list, newValue]);
      setNewValue("");
    }
  };

  const handleSave = () => {
    onSave(keyName, list.join(","), type);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {list.map((item) => (
          <Chip
            key={item}
            label={item}
            onDelete={() => handleRemoveValue(item)}
            sx={{ fontSize: "medium" }}
          />
        ))}
      </Box>

      <Select
        value=""
        onChange={(e) => handleAddValue(e.target.value)}
        displayEmpty
        fullWidth
      >
        <MenuItem value="">Select</MenuItem>
        {selectableValues.map((option: medicationProps) => (
          <MenuItem key={option.id}>{option.name}</MenuItem>
        ))}
      </Select>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="Enter a new value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          fullWidth
        />
        <Button
          onClick={handleAddCustomValue}
          variant="contained"
          color="primary"
        >
          <AddIcon />
        </Button>
      </Box>

      <Button onClick={handleSave} variant="contained" color="success">
        Save
      </Button>
    </Box>
  );
};

export default EditableList;
