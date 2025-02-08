import { Box, Container, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInstance";
import SearchBox from "../../components/SearchBox";
import { VisitDataInterface } from "../../components/VisitDataTypes";
import FollowUpFormComponent from "./FollowUpFormComponent";
import FollowUpSidebar from "./FollowUpSidebar";
import { useAuth } from "react-oidc-context";

const VisitFollowUpPage = () => {
  const [data, setData] = useState<VisitDataInterface | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const auth = useAuth();
  const access_token = auth.user?.access_token || "";

  const handleListItemClick = (index: number) => {
    if (data && index >= 0 && index < data?.followUpDetails.length)
      setSelectedIndex(index);
  };

  const getPatientData = async (search: string) => {
    try {
      const res = await axiosInstance.get(`/followup/${search}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setData(res.data);
      console.log(data);

      // Showing the current(to be filled or last filled) followup initially
      setSelectedIndex(() => {
        const today = Date.now();

        if (!data?.followUpDetails?.length) return 0;
        let index = 0;
        let fud = Date.parse(data.followUpDetails[0].date);

        for (let i = 0; i < data?.followUpDetails.length; i++) {
          const followUpDate = Date.parse(data.followUpDetails[i].date);
          if (followUpDate < today && followUpDate > fud) {
            fud = followUpDate;
            index = i;
          }
        }
        return index;
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (search) getPatientData(search);
  }, [search]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={3}>
            {/* Sidebar */}
            <Paper
              variant="outlined"
              sx={{
                padding: 2,
                position: "sticky",
                top: 16,
                height: "84vh",
                overflow: "auto",
              }}
            >
              {data && data.followUpDetails.length > 0 && (
                <FollowUpSidebar
                  selectedIndex={selectedIndex}
                  setIndex={handleListItemClick}
                  data={data}
                />
              )}
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            {/* Search Bar */}
            <SearchBox changeSearch={(input) => setSearch(input.value)} />

            <FollowUpFormComponent
              index={selectedIndex + 1}
              data={data && data.followUpDetails[selectedIndex]}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VisitFollowUpPage;
