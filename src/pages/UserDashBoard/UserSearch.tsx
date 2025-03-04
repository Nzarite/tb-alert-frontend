import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBox from "../../components/SearchBox";

const UserSearch = () => {
  const [role, setRole] = useState<any>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (location.pathname) {
      case "/user/telecaller":
        setRole("telecaller");
        break;

      case "/user/statehead":
        setRole("statehead");
        break;

      case "/user/fieldcoordinator":
        setRole("fieldcoordinator");
        break;

      case "/user/gphead":
        setRole("gphead");
        break;
    }
  }, [location]);

  const handleSearchChange = (selectedPatient: {
    value: string;
    label: string;
  }) => {
    if (selectedPatient?.value) {
      if (role === "telecaller")
        navigate(`/user/telecaller/${selectedPatient.value}`);
      if (role === "statehead")
        navigate(`/user/statehead/${selectedPatient.value}`);
    }
  };
  return (
    <div>
      <Box sx={{ p: 4 }}>
        <SearchBox changeSearch={handleSearchChange} role={role} />
      </Box>
    </div>
  );
};

export default UserSearch;
