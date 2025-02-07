import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stepper, Step, StepLabel, TextField, Grid, Paper } from "@mui/material";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type NikshayDetailsData = {
    nikshayId: string;
    udstDone: boolean;
    udstTestDate?: string;
    udstTestResult?: string;
    enrolledForDbt: boolean;
    dbtEnrollmentDate?: string;
    nikshayMitraLinked: boolean;
    nikshayMitraLinkDate?: string;
    nikshayMitraName?: string;
}

const nikshayDetailsSchema = z.object({
    nikshayId: z.string().min(1, "Nikshay ID is required"),
    udstDone: z.boolean(),
    udstTestDate: z.string().optional(),
    udstTestResult: z.string().optional(),
    enrolledForDbt: z.boolean(),
    dbtEnrollmentDate: z.string().optional(),
    nikshayMitraLinked: z.boolean(),
    nikshayMitraLinkDate: z.string().optional(),
    nikshayMitraName: z.string().optional(),
});

const NikshayDetailsForm = ( {language, data, onSave, onNext, onBack}:any ) => {

    interface LabelOption {
        label: string;
        options: { label: string; value: any }[];
    }
      
    interface NikshayDetailsFormLabelsData {
        nikshayIdLabel: string;
        udstDoneLabel: LabelOption;
        udstTestDateLabel: string;
        udstTestResultLabel: LabelOption;
        enrolledForDbtLabel: LabelOption;
        dbtEnrollmentDateLabel: string;
        nikshayMitraLinkedLabel: LabelOption;
        nikshayMitraLinkDateLabel: string;
        nikshayMitraNameLabel: string;
    }

    const [labels, setLabels] = useState<NikshayDetailsFormLabelsData>({
        nikshayIdLabel: "",
        udstDoneLabel: { label: "", options: [] },
        udstTestDateLabel: "",
        udstTestResultLabel: { label: "", options: [] },
        enrolledForDbtLabel: { label: "", options: [] },
        dbtEnrollmentDateLabel: "",
        nikshayMitraLinkedLabel: { label: "", options: [] },
        nikshayMitraLinkDateLabel: "",
        nikshayMitraNameLabel: ""
    });

    useEffect(() => {
        fetch(`/locales/patient_registration_form2_${language}.json`)
          .then((response) => response.json())
          .then((data) => setLabels(data.nikshaydetailsform || {}))
          .catch((error) => console.error("Error loading language file:", error));
    }, [language]);

    const {control, handleSubmit, formState: { errors }, setValue,  reset, register} = useForm<NikshayDetailsData>({
        defaultValues: data,
        resolver: zodResolver(
          nikshayDetailsSchema
        ),
    });

    const onSubmit = (stepData: NikshayDetailsData) => {
        onSave(stepData);
        onNext();
    };    

    const udstDone = useWatch({ control, name: "udstDone" });
    const enrolledForDbt = useWatch({ control, name: "enrolledForDbt" });
    const nikshayMitraLinked = useWatch({ control, name: "nikshayMitraLinked" });

    // const nikshayDetailsFields = [
    //     {name: "nikshayId", label: "Nikshay Id",type: "text"},
    //     {name: "udstDone", label: "Whether the PwTB done for UDST",type: "select",options: ["Yes", "No"]},
    //     {name: "udstTestDate",label: "If Yes, Date of Test Done",type: "date"},
    //     {name: "udstTestResult",label: "What is the test result",type: "select",options: ["Rifampicin Resistant", "Rifampicin Sensitive"]},
    //     {name: "enrolledForDbt",label: "Whether patient enrolled for DBT",type: "select",options: ["Yes", "No"]},
    //     {name: "dbtEnrollmentDate",label: "If Yes, Date",type: "date"},
    //     {name: "nikshayMitraLinked",label: "Whether PwTB linked for Nikshay Mitra",type: "select",options: ["Yes", "No"]},
    //     {name: "nikshayMitraLinkDate",label: "If Yes, Date of Linkage",type: "date"},
    //     {name: "nikshayMitraName",label: "Name of the Nikshay Mitra",type: "text"},
    //   ];

    if (!labels) return <p>Loading...</p>; 

    return (
        <Box>
            <Typography variant="h6">Nikshay Details</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField 
                    label={labels.nikshayIdLabel || "Nikshay Id"} 
                    {...register("nikshayId")} 
                    error={!!errors.nikshayId} 
                    helperText={errors.nikshayId?.message} 
                    fullWidth 
                    margin="normal" 
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>{labels.udstDoneLabel.label}</InputLabel>
                    <Controller 
                        name="udstDone" 
                        control={control} 
                        render={({ field }) => (
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
                                {labels.udstDoneLabel.options.map((option) => (
                                    <MenuItem key={option.value.toString()} value={option.value.toString()}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        )} 
                    />
                </FormControl>

                {udstDone && (
                    <TextField
                        label={labels.udstTestDateLabel || "UDST Test Date"}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...register("udstTestDate")}
                        fullWidth
                        margin="normal"
                    />
                )}

                {udstDone && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>{labels.udstTestResultLabel.label}</InputLabel>
                        <Controller
                            name="udstTestResult"
                            control={control}
                            render={({ field }) => (
                                <Select {...field}>
                                    {labels.udstTestResultLabel.options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel>{labels.enrolledForDbtLabel.label}</InputLabel>
                    <Controller
                        name="enrolledForDbt"
                        control={control}
                        render={({ field }) => (
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
                                {labels.enrolledForDbtLabel.options.map((option) => (
                                    <MenuItem key={option.value.toString()} value={option.value.toString()}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>

                {enrolledForDbt && (
                    <TextField
                        label={labels.dbtEnrollmentDateLabel || "DBT Enrollment Date"}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...register("dbtEnrollmentDate")}
                        fullWidth
                        margin="normal"
                    />
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel>{labels.nikshayMitraLinkedLabel.label}</InputLabel>
                    <Controller
                        name="nikshayMitraLinked"
                        control={control}
                        render={({ field }) => (
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
                                {labels.nikshayMitraLinkedLabel.options.map((option) => (
                                    <MenuItem key={option.value.toString()} value={option.value.toString()}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </FormControl>

                {nikshayMitraLinked && (
                    <TextField
                        label={labels.nikshayMitraLinkDateLabel || "Nikshay Mitra Link Date"}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...register("nikshayMitraLinkDate")}
                        fullWidth
                        margin="normal"
                    />
                )}

                {nikshayMitraLinked && (
                    <TextField
                        label={labels.nikshayMitraNameLabel || "Nikshay Mitra Name"}
                        {...register("nikshayMitraName")}
                        fullWidth
                        margin="normal"
                    />
                )}

                <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" color="secondary" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Save and Next
                </Button>
                </Box>
            </form>
        </Box>
  )
};

export default NikshayDetailsForm;

