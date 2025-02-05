import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientRegistrationData } from "../../pages/PatientRegistrationPage";

const nikshayDetailsSchema = z.object({
    
});

const NikshayDetailsForm = ( {language}:any ) => {

    // const [labels, setLabels] = useState<{ [key: string]: string }>({});
    const [labels, setLabels] = useState<{ [key: string]: string | { label: string; options: string[] } }>({});


    useEffect(() => {
        fetch(`/locales/patient_registration_form2_en.json`)
          .then((response) => response.json())
          .then((data) => setLabels(data.nikshaydetailsform))
          .catch((error) => console.error("Error loading language file:", error));
      }, [language]);

    const {control, handleSubmit, formState: { errors }, setValue,  reset, register} = useForm<PatientRegistrationData>({
        resolver: zodResolver(
          nikshayDetailsSchema
        ),
    });

    const udstDone = useWatch({ control, name: "udstDone" });
    const enrolledForDbt = useWatch({ control, name: "enrolledForDbt" });
    const nikshayMitraLinked = useWatch({ control, name: "nikshayMitraLinked" });

    const nikshayDetailsFields = [
        {name: "nikshayId", label: "Nikshay Id",type: "text"},
        {name: "udstDone", label: "Whether the PwTB done for UDST",type: "select",options: ["Yes", "No"]},
        {name: "udstTestDate",label: "If Yes, Date of Test Done",type: "date"},
        {name: "udstTestResult",label: "What is the test result",type: "select",options: ["Rifampicin Resistant", "Rifampicin Sensitive"]},
        {name: "enrolledForDbt",label: "Whether patient enrolled for DBT",type: "select",options: ["Yes", "No"]},
        {name: "dbtEnrollmentDate",label: "If Yes, Date",type: "date"},
        {name: "nikshayMitraLinked",label: "Whether PwTB linked for Nikshay Mitra",type: "select",options: ["Yes", "No"]},
        {name: "nikshayMitraLinkDate",label: "If Yes, Date of Linkage",type: "date"},
        {name: "nikshayMitraName",label: "Name of the Nikshay Mitra",type: "text"},
      ];

    if (!labels) return <p>Loading...</p>; 

    return (
        <>
        <TextField label={typeof labels.nikshayId === "string" ? labels.nikshayId : ""} {...register("nikshayId")} error={!!errors.nikshayId} helperText={errors.nikshayId?.message} fullWidth margin="normal" />

        <FormControl fullWidth margin="normal">
            <InputLabel>{typeof labels.udstDone === "object" ? labels.udstDone.label : ""}</InputLabel>
            <Controller name="udstDone" control={control} render={({ field }) => (
            <Select 
                {...field}
                onChange={(e) => {
                const value = e.target.value === "true";
                field.onChange(value);
                if (!value) {
                    setValue("udstTestDate", "");
                    setValue("udstTestResult", "");
                }
                }}
            >
                {typeof labels.udstDone === "object" && labels.udstDone.options.map((option: string) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
                {/* <MenuItem value={"true"}>Yes</MenuItem>
                <MenuItem value={"false"}>No</MenuItem> */}
            </Select>
            )} />
        </FormControl>

        {udstDone && (
            <>
            <TextField label={typeof labels.udstTestDate} type="date" InputLabelProps={{ shrink: true }} {...register("udstTestDate")} fullWidth margin="normal" />
            {/* <TextField label={labels.udstTestResult} {...register("udstTestResult")} fullWidth margin="normal" /> */}
            <FormControl fullWidth margin="normal">
            <InputLabel>{labels.udstTestResult.label}</InputLabel>
            <Controller
              name="udstTestResult"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  {labels.udstTestResult.options.map((option: string) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
            </>
        )}

        <FormControl fullWidth margin="normal">
            <InputLabel>{labels.enrolledForDbt.label}</InputLabel>
            <Controller name="enrolledForDbt" control={control} render={({ field }) => (
            <Select 
                {...field}
                onChange={(e) => {
                const value = e.target.value === "true";
                field.onChange(value);
                if (!value) {
                    setValue("dbtEnrollmentDate", "");
                }
                }}
            >
                {labels.enrolledForDbt.options.map((option: string) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
                {/* <MenuItem value={"true"}>Yes</MenuItem>
                <MenuItem value={"false"}>No</MenuItem> */}
            </Select>
            )} />
        </FormControl>

        {enrolledForDbt && (
            <TextField label={labels.dbtEnrollmentDate} type="date" InputLabelProps={{ shrink: true }} {...register("dbtEnrollmentDate")} fullWidth margin="normal" />
        )}

        <FormControl fullWidth margin="normal">
            <InputLabel>{labels.nikshayMitraLinked.label}</InputLabel>
            <Controller name="nikshayMitraLinked" control={control} render={({ field }) => (
            <Select 
                {...field}
                onChange={(e) => {
                const value = e.target.value === "true";
                field.onChange(value);
                if (!value) {
                    setValue("nikshayMitraLinkDate", "");
                    setValue("nikshayMitraName", "");
                }
                }}
            >
                {labels.nikshayMitraLinked.options.map((option: string) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
                {/* <MenuItem value={"true"}>Yes</MenuItem>
                <MenuItem value={"false"}>No</MenuItem> */}
            </Select>
            )} />
        </FormControl>

        {nikshayMitraLinked && (
            <>
            <TextField label={labels.nikshayMitraLinkDate} type="date" InputLabelProps={{ shrink: true }} {...register("nikshayMitraLinkDate")} fullWidth margin="normal" />
            <TextField label={labels.nikshayMitraName} {...register("nikshayMitraName")} fullWidth margin="normal" />
            </>
        )}
        </>
  )
};

export default NikshayDetailsForm;

