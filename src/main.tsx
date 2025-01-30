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
import PatientRegistrationPage from "./pages/PatientRegistrationPage";
import VisitFollowUpPage from "./pages/VisitFollowUpPage";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<LandingPage />} />
			<Route path="/registerPatient" element={<PatientRegistrationPage />} />
			<Route path="/visit" element={<VisitFollowUpPage />} />
			<Route path="/*" element={<ErrorPage />} />
		</>
	)
);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
