import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/Error/ErrorPage";
import VisitFollowUpPage from "./pages/FollowUp/VisitFollowUpPage";
import LandingPage from "./pages/Homepage/LandingPage";
import PageLayout from "./pages/PageLayout";
import PatientDashboardPage from "./pages/PatientDashboard/PatientDashboardPage";
import CaregiverRegistrationPage from "./pages/Registration/Caregiver/CaregiverRegistrationPage";
import PatientRegistrationPage from "./pages/Registration/Patient/PatientRegistrationPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SmsModulePage from "./pages/SmsModulePage";
import { store } from "./redux/store";
import ProtectedRoute from "./components/Authorization/ProtectedRoute";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "react-oidc-context";
import PatientSearchPage from "./pages/PatientDashboard/PatientSearchPage";
import StateHeadRegistrationPage from "./pages/Registration/StateHead/StateHeadRegistrationPage";
import TelecallerRegistrationPage from "./pages/Registration/Telecaller/TeleCallerRegistrationPage";
import UserSearch from "./pages/UserDashBoard/UserSearch.tsx";
import UserDashBoard from "./pages/UserDashBoard/UserDashBoard.tsx";

const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

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
      <Route path="/register/patient" element={<PatientRegistrationPage />} />
      <Route
        path="/register/caregiver"
        element={<CaregiverRegistrationPage />}
      />
      <Route path="/visit" element={<VisitFollowUpPage />} />
      <Route path="/patient-dashboard" element={<PatientSearchPage />} />
      <Route
        path="/patient-dashboard/:patientId"
        element={<PatientDashboardPage />}
      />
      <Route path="/reports" element={<Reports />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="*" element={<ErrorPage />} />

      <Route path="/register" element={<Navigate to={"/"} />} />
      <Route path="/user" element={<Navigate to={"/"} />} />
      <Route path="/unauthorized" element={<Navigate to={"/"} />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["SuperAdmin", "StateCoordinator"]} />
        }
      >
        <Route
          path="/register/telecaller"
          element={<TelecallerRegistrationPage />}
        />
        <Route path="/user/telecaller" element={<UserSearch />} />
        <Route
          path="/user/telecaller/:userId"
          element={<UserDashBoard role="telecaller" />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
        <Route
          path="/register/statehead"
          element={<StateHeadRegistrationPage />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user/statehead" element={<UserSearch />} />
        <Route
          path="/user/statehead/:userId"
          element={<UserDashBoard role="statehead" />}
        />
        <Route path="/sms-module" element={<SmsModulePage />} />
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
