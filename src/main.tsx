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
import VisitFollowUpPage from "./pages/VisitFollowUpComponent/VisitFollowUpPage";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<PageLayout />}>
			<Route path="/" element={<LandingPage />} />
			<Route path="/registerPatient" element={<PatientRegistrationPage />} />
			<Route path="/visit" element={<VisitFollowUpPage />} />
			<Route path="*" element={<ErrorPage />} />
		</Route>
	)
);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
