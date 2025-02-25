import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/Error/ErrorPage";
import VisitFollowUpPage from "./pages/FollowUp/VisitFollowUpPage";
import LandingPage from "./pages/Homepage/LandingPage";
import PageLayout from "./pages/PageLayout";
import PatientDashboardPage from "./pages/PatientDashboard/PatientDashboardPage";
import PatientSearchPage from "./pages/PatientDashboard/PatientSearchPage";
import CaregiverRegistrationPage from "./pages/Registration/Caregiver/CaregiverRegistrationPage";
import PatientRegistrationPage from "./pages/Registration/Patient/PatientRegistrationPage";
import StateHeadRegistrationPage from "./pages/Registration/StateHead/StateHeadRegistrationPage";
import TelecallerRegistrationPage from "./pages/Registration/Telecaller/TeleCallerRegistrationPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SmsModulePage from "./pages/SmsModulePage";
import { store } from "./redux/store";

const theme = createTheme({
	palette: {
		background: {
			default: "#fafafa",
		},
		primary: {
			main: "#0B455C",
		},
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					boxShadow: "none",
					border: "1px solid lightGray",
				},
			},
		},
	},
	typography: {
		fontSize: 12,
	},
});

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<PageLayout />}>
			<Route path="/" element={<LandingPage />} />
			<Route path="/register/caregiver" element={<CaregiverRegistrationPage />} />
			<Route path="/register/patient" element={<PatientRegistrationPage />} />
			<Route path="/visit" element={<VisitFollowUpPage />} />
			<Route
				path="/register/state-coordinator"
				element={<StateHeadRegistrationPage />}
			/>
			<Route path="/register/telecaller" element={<TelecallerRegistrationPage />} />
			<Route path="/dashboard/patient" element={<PatientSearchPage />} />
			<Route path="/dashboard/patient/:patientId" element={<PatientDashboardPage />} />
			<Route path="*" element={<ErrorPage />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/reports" element={<Reports />} />
			<Route path="/sms/module" element={<SmsModulePage />} />
		</Route>
	)
);

createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</ThemeProvider>
);
