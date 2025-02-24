import { configureStore } from "@reduxjs/toolkit";
import langReducer from "./langSlice";
import userReducer from "./userSlice";

export const store = configureStore({
	reducer: {
		language: langReducer,
		user: userReducer,
	},
	// middleware: (getDefaultMiddleware) => 
	// 	getDefaultMiddleware().concat(logger), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

