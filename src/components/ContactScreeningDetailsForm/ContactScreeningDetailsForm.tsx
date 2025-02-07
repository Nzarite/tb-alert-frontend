import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type ContactScreeningData = {
    contactScreeningDone: boolean;
    contactScreeningDate: string;
    availableHhcs: number;
    screenedHhcs: number;
    hhcsWithTbSymptoms: number;
    hhcsReferredForTbTesting: number;
    hhcsDiagnosedTb: number;
    hhcsDiagnosedTbOnAtt: number;
    hhcsUndergoneLBTI: number;
    eligibleForTpt: number;
    hhcsInitiatedOnTpt: number;
}

const contactScreeningDetailsSchema = z.object({
    ontactScreeningDone: z.boolean(),
    contactScreeningDate: z.string().optional(),
    availableHhcs: z.number().optional(),
    screenedHhcs: z.number().optional(),
    hhcsWithTbSymptoms: z.number().optional(),
    hhcsReferredForTbTesting: z.number().optional(),
    hhcsDiagnosedTb: z.number().optional(),
    hhcsDiagnosedTbOnAtt: z.number().optional(),
    hhcsUndergoneLBTI: z.number().optional(),
    eligibleForTpt: z.number().optional(),
    hhcsInitiatedOnTpt: z.number().optional(),
});

const ContactScreeningDetailsForm = ( {language, data, onSave, onSubmit, onBack}:any ) => {

    interface LabelOption {
        label: string;
        options?: { label: string; value: boolean }[];
    }
    
    interface ContactScreeningDetailsFormLabelsData {
        contactScreeningDoneLabel: LabelOption;
        contactScreeningDateLabel: string;
        availableHhcsLabel: string;
        screenedHhcsLabel: string;
        hhcsWithTbSymptomsLabel: string;
        hhcsReferredForTbTestingLabel: string;
        hhcsDiagnosedTbLabel: string;
        hhcsDiagnosedTbOnAttLabel: string;
        hhcsUndergoneLBTILabel: string;
        eligibleForTptLabel: string;
        hhcsInitiatedOnTptLabel: string;
    }    

    const [labels, setLabels] = useState<ContactScreeningDetailsFormLabelsData>({
        contactScreeningDoneLabel: { label: "", options: [] },
        contactScreeningDateLabel: "",
        availableHhcsLabel: "",
        screenedHhcsLabel: "",
        hhcsWithTbSymptomsLabel: "",
        hhcsReferredForTbTestingLabel: "",
        hhcsDiagnosedTbLabel: "",
        hhcsDiagnosedTbOnAttLabel: "",
        hhcsUndergoneLBTILabel: "",
        eligibleForTptLabel: "",
        hhcsInitiatedOnTptLabel: ""
      });

    useEffect(() => {
        fetch(`/locales/patient_registration_form3_${language}.json`)
          .then((response) => response.json())
          .then((data) => setLabels(data.nikshaydetailsform))
          .catch((error) => console.error("Error loading language file:", error));
    }, [language]);

    const {control, handleSubmit, formState: { errors }, setValue,  reset, register} = useForm<ContactScreeningData>({
        defaultValues: data,
        resolver: zodResolver(
            contactScreeningDetailsSchema
    ),
    });

    const contactScreeningDone = useWatch({ control, name: "contactScreeningDone" });

    const onFormSubmit = (stepData: ContactScreeningData) => {
        onSave(stepData);
        onSubmit(stepData); // Submit final data
      };    

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
        <Box>
        <Typography variant="h6">Contact Screening Details</Typography>
        <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormControl fullWidth margin="normal">
                    <InputLabel>{labels.contactScreeningDoneLabel.label}</InputLabel>
                    <Controller
                        name="contactScreeningDone"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value === "true";
                                    field.onChange(value);
                                    if (!value) {
                                        Object.keys(labels).forEach((key) => setValue(key as keyof ContactScreeningData, ""));
                                    }
                                }}
                            >
                                {labels.contactScreeningDoneLabel.options?.map((option) => (
                                    <MenuItem key={option.value.toString()} value={option.value.toString()}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>

                {contactScreeningDone &&
                    Object.keys(labels).map((key) => {
                        if (key !== "contactScreeningDoneLabel") {
                            return (
                                <TextField
                                    key={key}
                                    label={(labels as any)[key]}
                                    type="number"
                                    {...register(key as keyof ContactScreeningData)}
                                    fullWidth
                                    margin="normal"
                                />
                            );
                        }
                        return null;
                    })}
        {/* <FormControl fullWidth margin="normal">
        <InputLabel>{labels.contactScreeningDoneLabel.label}</InputLabel>
        <Controller name="contactScreeningDone" control={control} render={({ field }) => (
        <Select 
            {...field}
            onChange={(e) => {
            const value = e.target.value === "true";
            field.onChange(value);
            if (!value) {
                contactScreeningDetailsFields.forEach(field => setValue(field.name as keyof ContactScreeningData, ""));
            }
            }}
        >
            <MenuItem value={"true"}>Yes</MenuItem>
            <MenuItem value={"false"}>No</MenuItem>
        </Select>
        )} />
    </FormControl>

    {contactScreeningDone && contactScreeningDetailsFields.map(({ name, type }) => (
        <TextField key={name} label={labels[name]} type={type} {...register(name as keyof ContactScreeningData)} fullWidth margin="normal" />
    ))} */}

    <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="success">
            Submit
          </Button>
        </Box>
    </form>
    </Box>
    )
};

export default ContactScreeningDetailsForm;
