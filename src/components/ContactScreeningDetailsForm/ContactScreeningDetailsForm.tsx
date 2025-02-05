import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientRegistrationData } from "../../pages/PatientRegistrationPage";

const contactScreeningDetailsSchema = z.object({
    
});

const ContactScreeningDetailsForm = ( {language}:any ) => {

    const [labels, setLabels] = useState<{ [key: string]: string } | null>(null);

    useEffect(() => {
        fetch(`/locales/patient_registration_form3_en.json`)
          .then((response) => response.json())
          .then((data) => setLabels(data.nikshaydetailsform))
          .catch((error) => console.error("Error loading language file:", error));
    }, [language]);

    const {control, handleSubmit, formState: { errors }, setValue,  reset, register} = useForm<PatientRegistrationData>({
    resolver: zodResolver(
        contactScreeningDetailsSchema
    ),
    });

    const contactScreeningDone = useWatch({ control, name: "contactScreeningDone" });

    const contactScreeningDetailsFields = [
    // {name: "contactScreeningDone", label: "Contact Screening done (Yes/No)",type: "select",options: ["Yes", "No"]},
    {name: "contactScreeningDate", label: "Date of Contact Screening",type: "number"},
    {name: "availableHhcs", label: "No of HHCs available",type: "number"},
    {name: "screenedHhcs", label: "No of HHCs screened",type: "number"},
    {name: "hhcsWithTbSymptoms", label: "No of HHCs found with TB Sympotoms",type: "number"},
    {name: "hhcsReferredForTbTesting", label: "No of HHCs found with TB Sympotoms referred for TB testing",type: "number"},
    {name: "hhcsDiagnosedTb", label: "No.of HHCs diagnosed TB",type: "number"},
    {name: "hhcsDiagnosedTbOnAtt", label: "No of HHCs diagnosed with TB initiated on ATT",type: "number"},
    {name: "hhcsUndergoneLBTI", label: "No of HHCs undergone for LTBI test",type: "number"},
    {name: "eligibleForTpt", label: "No.of eligible for TPT",type: "number"},
    {name: "hhcsInitiatedOnTpt", label: "No of HHCs initiated on TPT",type: "number"},
    ];

    if (!labels) return <p>Loading...</p>;

    return (
        <>
        <FormControl fullWidth margin="normal">
        <InputLabel>{labels.contactScreeningDone}</InputLabel>
        <Controller name="contactScreeningDone" control={control} render={({ field }) => (
        <Select 
            {...field}
            onChange={(e) => {
            const value = e.target.value === "true";
            field.onChange(value);
            if (!value) {
                contactScreeningDetailsFields.forEach(field => setValue(field.name as keyof PatientRegistrationData, ""));
            }
            }}
        >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
        </Select>
        )} />
    </FormControl>

    {contactScreeningDone && contactScreeningDetailsFields.map(({ name, type }) => (
        <TextField key={name} label={labels[name]} type={type} {...register(name as keyof PatientRegistrationData)} fullWidth margin="normal" />
    ))}
    </>
    )
};

export default ContactScreeningDetailsForm;
