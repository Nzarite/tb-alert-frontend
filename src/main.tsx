import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
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
import PatientRegistrationPage from "./pages/Registration/Patient/PatientRegistrationPage";
import StateCoordinatorRegistrationPage from "./pages/Registration/StateCoordinator/StateCoordinatorRegistrationPage";
import TeleCommunicatorRegistration from "./pages/Registration/Telecommunicator/TeleCommunicatorRegistration";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

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
					borderRadius: 12,
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
			<Route path="/register/patient" element={<PatientRegistrationPage />} />
			<Route path="/visit" element={<VisitFollowUpPage />} />
			<Route
				path="/register/state-coordinator"
				element={<StateCoordinatorRegistrationPage />}
			/>
			<Route path="/register/telecommunicator" element={<TeleCommunicatorRegistration />} />
			<Route path="/reports" element={<Reports />} />
			<Route path="*" element={<ErrorPage />} />
			<Route path="settings" element={<Settings />} />
			<Route path="/reports" element={<Reports />} />
		</Route>
	)
);

createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<RouterProvider router={router} />
	</ThemeProvider>
);
