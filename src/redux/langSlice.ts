import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	language: "en",
};

export const langSlice = createSlice({
	name: "language",
	initialState,
	reducers: {
		updateLanguage: (state, action) => {
			state.language = action.payload;
		},
	},
});

export const { updateLanguage } = langSlice.actions;
export default langSlice.reducer;
