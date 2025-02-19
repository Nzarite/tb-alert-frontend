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
import RegisterWrapper from "./pages/Registration/RegisterWrapper";
import StateCoordinatorRegistrationPage from "./pages/Registration/StateCoordinator/StateCoordinatorRegistrationPage";
import TeleCommunicatorRegistration from "./pages/Registration/Telecommunicator/TeleCommunicatorRegistration";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
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
      <Route
        path="/register/caregiver"
        element={<CaregiverRegistrationPage />}
      />
      <Route path="/register" element={<RegisterWrapper />} />
      <Route path="/register/patient" element={<PatientRegistrationPage />} />
      <Route path="/visit" element={<VisitFollowUpPage />} />
      <Route
        path="/register/state-coordinator"
        element={<StateCoordinatorRegistrationPage />}
      />
      <Route
        path="/register/telecommunicator"
        element={<TeleCommunicatorRegistration />}
      />
      <Route path="/patient-dashboard" element={<PatientSearchPage />} />
      <Route
        path="/patient-dashboard/:patientId"
        element={<PatientDashboardPage />}
      />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="*" element={<ErrorPage />} />
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
