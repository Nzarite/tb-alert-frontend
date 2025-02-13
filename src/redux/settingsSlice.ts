import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface settingType {
  key: string;
  value: string;
  type: string;
}

interface settingsState {
    settings: settingType[]
}

const initialState: settingsState = {
    settings: [
        { key: "sms_reminder_before", value: "1 hour", type: "schedule" },
        { key: "patient_registration_template", value: "Template 3", type: "sms" },
        { key: "dstb_followups", value: "1", type: "schedule" },
        { key: "drtb_followups", value: "2", type: "schedule" },
    ]
}

export const settingsSlice = createSlice({
    name: "settings", 
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<settingType[]>) => {
            state.settings  = action.payload;
        },

        updateSettings: (state, action: PayloadAction<{key: string; value: string}>) => {
            const {key, value} = action.payload;
            const setting = state.settings.find(s => s.key==key);

            if(setting){
                setting.value=value;
            }
        }
    }
})

export const {setSettings, updateSettings} = settingsSlice.actions;
export default settingsSlice.reducer;



