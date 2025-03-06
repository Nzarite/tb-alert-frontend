import { Divider, Grid, Typography } from "@mui/material";
import { renderField } from "../PatientDashboard/PatientNikshayDetails";
import { StateHead, TeleCaller } from "../../components/datatypes/DataTypes";
import { useEffect, useState } from "react";
import { ScTcRegistrationFormLabelsData } from "../Registration/StateHead/StateHeadRegistrationPage";
import { useSelector } from "react-redux";

interface SearchProps {
  user: TeleCaller | StateHead;
}

const UserPersonalDetails = ({ user }: SearchProps) => {
  const [labels, setLabels] = useState<ScTcRegistrationFormLabelsData>({
    userIdLabel: "",
    firstNameLabel: "",
    lastNameLabel: "",
    genderLabel: { label: "", options: [] },
    phoneNumberLabel: "",
    emailLabel: "",
    dateOfJoiningLabel: "",
    dateOfLeavingLabel: "",
    stateLabel: "",
  });
  const language = useSelector((state: any) => state.language.language);

  useEffect(() => {
    fetch(`/locales/sc_tc_registration_form_${language}.json`)
      .then((response) => response.json())
      .then((data) => setLabels(data.scandtcregistrationform))
      .catch((error) => {
        console.error("Error loading form labels file:", error);
        alert("Failed to load form labels data. Please try again.");
      });
  }, [language]);

  let fields = [
    {
      name: user.hasOwnProperty("stateHeadId") ? "stateHeadId" : "teleCallerId",
      label: labels.userIdLabel,
      size: 12,
    },
    { name: "firstName", label: labels.firstNameLabel, size: 6 },
    { name: "lastName", label: labels.lastNameLabel, size: 6 },
    { name: "gender", label: labels.genderLabel, size: 6 },
    { name: "state", label: labels.stateLabel, size: 6 },
    { name: "phoneNumber", label: labels.phoneNumberLabel, size: 6 },
    { name: "dateOfJoining", label: labels.dateOfJoiningLabel, size: 6 },
    { name: "email", label: labels.emailLabel, size: 6 },
    { name: "dateOfLeaving", label: labels.dateOfLeavingLabel, size: 6 },
  ];

  return (
    <>
      <Divider sx={{ mb: 4 }} />
      {user ? (
        <Grid container spacing={3} sx={{ padding: "0px 40px" }}>
          {fields.map((item, index) => renderField(user, item, index))}
        </Grid>
      ) : (
        <Typography align="center" variant="body2" color="textSecondary">
          Unable to fetch data
        </Typography>
      )}
    </>
  );
};

export default UserPersonalDetails;
