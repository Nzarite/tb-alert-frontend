import { Box, Container, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../components/axiosInstance";
import { VisitDataInterface } from "../../components/datatypes/DataTypes";
import SearchBox from "../../components/SearchBox";
import FollowUpFormComponent from "./FollowUpMain";
import FollowUpSidebar from "./FollowUpSidebar";
import { useAuth } from "react-oidc-context";

const VisitFollowUpPage = () => {
  const location = useLocation();
  const initialState = location.state?.prop || null;

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
      const res = await axiosInstance.get(`/followup/${search}`);
      const res2 = await axiosInstance.get(`/patientmedication/${search}`);

      let newData: VisitDataInterface = res.data;
      newData.followUpDetails.forEach((followup) => {
        if (!followup.followUpStatus) followup.medicationDetails = res2.data;
      });
      setData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const findFollowUpIndex = (data: VisitDataInterface) => {
    const today = Date.now();
    if (!data?.followUpDetails?.length) return 0;

    return data.followUpDetails.reduce((bestIndex, followUp, i) => {
      const followUpDate = Date.parse(followUp.date);
      return followUpDate < today &&
        followUpDate > Date.parse(data.followUpDetails[bestIndex].date)
        ? i
        : bestIndex;
    }, 0);
  };

  useEffect(() => {
    if (data) {
      setSelectedIndex(findFollowUpIndex(data));
    }
  }, [data]);

  useEffect(() => {
    if (search) getPatientData(search);
  }, [search, setData]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {data && (
            <Grid item xs={12} md={3}>
              {/* Sidebar */}
              <Paper
                variant="outlined"
                sx={{
                  padding: 2,
                  height: "78vh",
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
          )}
          {data ? (
            <Grid item xs={12} md={9}>
              {/* Search Bar */}
              <SearchBox changeSearch={(input) => setSearch(input.value)} />
              <FollowUpFormComponent
                index={selectedIndex}
                data={data}
                getPatientData={(input) => getPatientData(input)}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              {/* Search Bar */}
              <SearchBox changeSearch={(input) => setSearch(input.value)} />
              <FollowUpFormComponent
                index={selectedIndex}
                data={data}
                getPatientData={(input) => getPatientData(input)}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default VisitFollowUpPage;
