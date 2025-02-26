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

import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
import { store } from "./redux/store";
import ProtectedRoute from "./components/Authorization/ProtectedRoute";
import UnauthorizedPage from "./pages/Unauthorized/UnauthorizedPage";
import UserProfile from "./pages/UserProfile";
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
      {/* Routes accessible by all logged in users */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/register/patient" element={<PatientRegistrationPage />} />

      <Route
        path="/register/caregiver"
        element={<CaregiverRegistrationPage />}
      />

      <Route path="/visit" element={<VisitFollowUpPage />} />
      <Route path="/dashboard/patient" element={<PatientSearchPage />} />
      <Route
        path="/dashboard/patient/:patientId"
        element={<PatientSearchPage />}
      />
      <Route
        path="/dashboard/patient/:patientId"
        element={<PatientDashboardPage />}
      />

      <Route path="/reports" element={<Reports />} />

      <Route path="*" element={<ErrorPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="profile" element={<UserProfile />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["SuperAdmin", "StateCoordinator"]} />
        }
      >
        <Route
          path="/register/telecommunicator"
          element={<TeleCommunicatorRegistration />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        <Route
          path="/register/state-coordinator"
          element={<StateCoordinatorRegistrationPage />}
        />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider {...oidcConfig}>
      <ThemeProvider theme={theme}>
        <PrivateRoute>
          <RouterProvider router={router} />
        </PrivateRoute>
      </ThemeProvider>
    </AuthProvider>
  </Provider>
);
