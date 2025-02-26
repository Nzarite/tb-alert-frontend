import { useEffect, useState } from "react";
import SearchBox from "../../components/SearchBox";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const UserSearch = () => {
  const [role, setRole] = useState<any>("");
  const location = useLocation();
  const navigate=useNavigate();

  useEffect(() => {
    if (location.pathname === "/user/telecaller") setRole("telecaller");
    else if (location.pathname === "/user/statehead") setRole("statehead");
  }, [location]);

  const handleSearchChange = (selectedPatient: { value: string; label: string }) => {
    if (selectedPatient?.value) {
      if(role==="telecaller") navigate(`/user/telecaller/${selectedPatient.value}`)
      if(role==="statehead")  navigate(`/user/statehead/${selectedPatient.value}`)
    }
  };
  return (
    <div>
      <Box sx={{ p: 4 }}>
      <SearchBox
        changeSearch={handleSearchChange}
        role={role}
      />
      </Box>
    </div>
  );
};

export default UserSearch;
