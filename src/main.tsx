import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/ErrorPage";
import LandingPage from "./pages/LandingPage";
import PageLayout from "./pages/PageLayout";
import PatientRegistrationPage from "./pages/PatientRegistrationPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import VisitFollowUpPage from "./pages/VisitFollowUpComponent/VisitFollowUpPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/registerPatient" element={<PatientRegistrationPage />} />
      <Route path="/visit" element={<VisitFollowUpPage />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
