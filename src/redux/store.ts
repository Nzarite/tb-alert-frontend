import { configureStore } from "@reduxjs/toolkit";
import langReducer from "./langSlice";

export const store = configureStore({
	reducer: langReducer,
});
