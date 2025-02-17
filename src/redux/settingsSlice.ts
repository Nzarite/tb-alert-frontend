import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface settingType {
  keyName: string;
  value: string;
  type: string;
}

interface settingsState {
    settings: settingType[]
}

const initialState: settingsState = {
    settings: []
}

export const settingsSlice = createSlice({
    name: "admin", 
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<settingType[]>) => {
            state.settings  = action.payload;
            
        },

        addSetting: (state, action: PayloadAction<settingType>) => {
            state.settings.push(action.payload);
        },

        updateSettings: (state, action: PayloadAction<{keyName: string; newValue: string}>) => {
            const {keyName, newValue} = action.payload;
           state.settings = state.settings.map(setting => {
                return setting.keyName==keyName ?
                {...setting, value: newValue} :
                setting;
           })
        }
    }
})

export const {setSettings, updateSettings, addSetting} = settingsSlice.actions;
export default settingsSlice.reducer;



