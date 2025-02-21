import {
  Autocomplete,
  Box,
  Button,
  Chip,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toSnakeCase } from "../../utils/utils";
import axiosInstance from "../axiosInstance";
import { DBEntryType, SettingListItemProps } from "../datatypes/DataTypes";

const SettingListItem = ({
  keyName,
  value,
  type,
  getSettings,
}: SettingListItemProps) => {
  interface stateType {
    dbEntries: { id: string; name: string }[];
    available: string[];
    current: string[];
    selected: string[];
    selectable: string[];
    new: string;
  }

  const [state, setState] = useState<stateType>({
    dbEntries: [],
    available: [],
    current: value.split(","),
    selected: [],
    selectable: [],
    new: "",
  });
  const feature = toSnakeCase(type);

  useEffect(() => {
    axiosInstance
      .get(`/${feature}/all`)
      .then((response) => {
        const data = response.data;
        const names: string[] = data.map((entry: DBEntryType) => entry?.name);

        setState((prevState) => {
          return {
            ...prevState,
            dbEntries: data.map((entry: DBEntryType) => {
              return {
                id: entry?.id.toString(),
                name: entry?.name,
              };
            }),
            current: state.current.map((id) => {
              const dbEntry: DBEntryType = data.find(
                (entry: DBEntryType) => entry.id == id
              );

              return dbEntry?.name;
            }),
            available: names,
            selectable: data
              .filter(
                (entry: DBEntryType) =>
                  !value.split(",").includes(entry?.id.toString())
              )
              .map((entry: DBEntryType) => entry?.name),
          };
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const getDBEntries = async () => {
    try {
      const response = await axiosInstance.get(`${feature}/all`);
      const data = response.data;
      setState((prev) => {
        return {
          ...prev,
          dbEntries: data.map((entry: DBEntryType) => {
            return {
              id: entry?.id.toString(),
              name: entry?.name,
            };
          }),
        };
      });
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveValue = (removeValue: string) => {
    setState((prevState) => {
      return {
        ...prevState,
        current: prevState.current.filter((value) => value != removeValue),
        selected: prevState.selected.filter((value) => value != removeValue),
        selectable: [...prevState.selectable, removeValue],
      };
    });
  };

  const addEntry = async (name: string) => {
    const response = await axiosInstance.post(`${feature}`, { name });
    const entry: DBEntryType = response.data;
    setState((prev) => {
      return {
        ...prev,
        dbEntries: [...state.dbEntries, { id: entry.id, name: entry.name }],
      };
    });
  };

  const getId = (name: string, dbEntries: DBEntryType[]) => {
    const dbEntry: DBEntryType | undefined = dbEntries.find(
      (entry: DBEntryType) => entry?.name == name
    );

    return dbEntry ? dbEntry.id : null;
  };

  const handleSave = async () => {
    await Promise.all(
      state.current.map(async (name: string) => {
        if (
          !state.dbEntries.find((entry: DBEntryType) => entry?.name === name)
        ) {
          await addEntry(name);
        }
      })
    );

    const dbEntries: DBEntryType[] = await getDBEntries();

    console.log(dbEntries);

    let newValue: string[] = [];
    state.current.forEach((name: string) => {
      const id = getId(name, dbEntries);
      if (id) {
        newValue.push(id);
      }
    });

    console.log(newValue);

    const requestBody = {
      keyName: toSnakeCase(keyName),
      value: newValue.join(","),
      type: toSnakeCase(type),
    };

    await axiosInstance
      .put("setting", requestBody)
      .then(() => getSettings())
      .catch((error) => console.log(error.message));

    getSettings();
  };

  return (
    <ListItem key={keyName}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            margin: "10px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Typography>{keyName}: </Typography>

          <Box sx={{ maxWidth: "600px" }}>
            {state.current.map((item) => (
              <Chip
                key={item}
                label={item}
                onDelete={() => handleRemoveValue(item)}
                sx={{ fontSize: "medium" }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ margin: "10px", display: "flex", alignItems: "center" }}>
          <Autocomplete
            sx={{ width: "300px" }}
            multiple
            freeSolo
            options={state.selectable}
            value={state.selected} // Array of selected items
            onChange={(_event, newValues: string[]) => {
              setState((prevState) => {
                return {
                  ...prevState,
                  selected: [...prevState.selected, ...newValues],
                  selectable: prevState.selectable.filter(
                    (value) => !newValues.includes(value)
                  ),
                  current: [...new Set([...prevState.current, ...newValues])],
                };
              });
            }}
            disableCloseOnSelect
            clearOnBlur
            renderTags={() => null} // Hides selected items inside input field
            renderInput={(params) => <TextField {...params} label="Select " />}
            fullWidth
          />
        </Box>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </ListItem>
  );
};

export default SettingListItem;
