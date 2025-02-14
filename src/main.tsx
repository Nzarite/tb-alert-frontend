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
import PatientRegistrationPage from "./pages/Registration/Patient/PatientRegistrationPage";
import StateCoordinatorRegistrationPage from "./pages/Registration/StateCoordinator/StateCoordinatorRegistrationPage";
import TeleCommunicatorRegistration from "./pages/Registration/Telecommunicator/TeleCommunicatorRegistration";
import CaregiverRegistrationPage from "./pages/Registration/Caregiver/CaregiverRegistrationPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import PrivateRoute from "./components/PrivateRoute";
import { store } from "./redux/store";

import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "http://localhost:8081/realms/tb-alert",
  client_id: "tb-alert-frontend",
  redirect_uri: "http://localhost:5173",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
import PatientSearchPage from "./pages/PatientDashboard/PatientSearchPage";

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
				element={<StateCoordinatorRegistrationPage />}
			/>
			<Route path="/register/telecommunicator" element={<TeleCommunicatorRegistration />} />
			<Route path="/dashboard/patient" element={<PatientSearchPage />} />
			<Route path="/dashboard/patient/:patientId" element={<PatientDashboardPage />} />
			<Route path="/reports" element={<Reports />} />
			<Route path="*" element={<ErrorPage />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/reports" element={<Reports />} />
		</Route>
	)
);

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...oidcConfig}>
    <ThemeProvider theme={theme}>
      <PrivateRoute>
        <RouterProvider router={router} />
      </PrivateRoute>
    </ThemeProvider>
  </AuthProvider>
);
