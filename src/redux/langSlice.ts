import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
	language: string;
}

const getInitialLanguage = (): string => {
	const storedLang = localStorage.getItem("lang");
	if (storedLang) return storedLang;

	const defaultLang = "en";
	localStorage.setItem("lang", defaultLang);
	return defaultLang;
};

const initialState: LanguageState = {
	language: getInitialLanguage(),
};

export const langSlice = createSlice({
	name: "language",
	initialState,
	reducers: {
		updateLanguage: (state, action: PayloadAction<string>) => {
			if (state.language !== action.payload) {
				state.language = action.payload;
				localStorage.setItem("lang", state.language);
			}
		},
	},
});

export const { updateLanguage } = langSlice.actions;
export default langSlice.reducer;
