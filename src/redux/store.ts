import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import langReducer from "./langSlice";
import settingsReducer from './settingsSlice';
import userReducer from "./userSlice";

export const store = configureStore({
	reducer: {
		language: langReducer,
		user: userReducer,
		settings: settingsReducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().concat(logger), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

