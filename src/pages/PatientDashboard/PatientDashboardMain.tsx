import { selectionListDataTypes } from "./PatientDashboardPage";
import PatientMedicalDetails from "./PatientMedicalDetails";
import PatientMedicationDetails from "./PatientMedicationDetails";
import PatientNikshayDetails from "./PatientNikshayDetails";
import PatientPersonalDetails from "./PatientPersonalDetails";

interface PatientDashboardMainProps {
	selectionList: selectionListDataTypes[];
	selectionIndex: number;
}

const PatientDashboardMain = ({ selectionList, selectionIndex }: PatientDashboardMainProps) => {
	const renderMainContent = () => {
		switch (selectionList[selectionIndex].name) {
			case "Personal Records":
				return <PatientPersonalDetails />;
			case "Medical Records":
				return <PatientMedicalDetails />;
			case "Nikshay Details":
				return <PatientNikshayDetails />;
			case "Medications":
				return <PatientMedicationDetails />;
			default:
				null;
		}
	};

	return <>{renderMainContent()}</>;
};

export default PatientDashboardMain;
