import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../components/axiosInstance";
import { VisitDataInterface } from "../../components/datatypes/DataTypes";
import SearchBox from "../../components/SearchBox";
import FollowUpFormComponent from "./FollowUpMain";
import FollowUpSidebar from "./FollowUpSidebar";
import FollowUPStatus from "../../components/Json/FollowUpStatus.json";
import { useAuth } from "react-oidc-context";

const VisitFollowUpPage = () => {
  const location = useLocation();
  const initialState = location.state?.prop || null;
  const [search, setSearch] = useState<string | null>(initialState);

  const [data, setData] = useState<VisitDataInterface | null>(null);
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
        followUp.followUpStatus !== FollowUPStatus.Cancelled &&
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
        paddingTop: { xs: 1, sm: 2, md: 3 },
        px: 2,
        height: "100%",
      }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ height: "100%" }}>
        {data && (
          <Grid item xs={12} md={3}>
            {/* Sidebar */}
            <FollowUpSidebar
              selectedIndex={selectedIndex}
              setIndex={handleListItemClick}
              data={data}
            />
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
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default VisitFollowUpPage;
