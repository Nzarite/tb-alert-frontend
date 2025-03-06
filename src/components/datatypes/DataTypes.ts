export interface VisitDataInterface {
	patient: PatientInterface;
	followUpDetails: FollowUpsDataInterface[];
}

export interface PatientInterface {
	patientId: string;
	personId: number;
	firstName: string;
	lastName: string;
	gender: string;
	age: number;
	phoneNumber: string;
	email: string;
	block: string;
	gp: string;
	village: string;
	district: string;
	state: string;
	currentStatus: string;
	cured: boolean;
	createdAt: string;
	createdBy: string;
	updatedBy: string | null;
}

export interface TeleCallerInterface {
	teleCallerId: number;
	personId: number;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	gender: string;
	block: string;
	gp: string;
	village: string;
	district: string;
	state: string;
	createdBy: string;
	createdOn: string;
	updatedBy: string | null;
	dateOfJoining: string;
}

export interface StateHeadInterface {
	stateHeadId: number;
	personId: number;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	gender: string;
	block: string;
	gp: string;
	village: string;
	district: string;
	state: string;
	createdBy: string;
	createdOn: string;
	updatedBy: string | null;
	dateOfJoining: string;
}

export interface FollowUpsDataInterface {
	date: string;
	followUpStatus: string;
	remarks: string;
	patientCondition: number;
	medicationDetails: MedicationInterface[] | [];
}

export interface MedicationInterface {
	medicationId: number;
	medicationName: string;
	missedDosages: number;
	comments: string;
}

export interface PatientMedicalInterface {
	dateOfDiagnosis: string;
	dateOfTreatmentInitiation: string;
	typeOfPwtb: string;
	typeOfTb: string;
	dstbOrDrtb: string;
	patientId: string;
}

export interface LabelOption {
  label: string;
  options: { label: string; value: any }[];
}

export type StateOption = {
  label: string;
  value: string;
};

export interface DashboardFieldsProp {
	name: string;
  label: string | LabelOption;
	size: number;
}

export interface PatientNikshayInterface {
	nikshayId: string;
	nikshayMitraName: string;
	nikshayMitraDate: string;
	nikshayMitraStatus: string;
	dateOfDbt: string;
	dbtStatus: boolean;
	dateOfUdst: string;
	udstStatus: boolean;
	resultOfUdst: string;
	patientId: number;
}

export interface PatientMedicineInterface {
	medicationName: string;
	frequency: number;
}

export interface PatientContactScreeningInterface {
	contactScreeningDone: boolean;
	dateOfContactScreening: string;
	noOfHHCsAvailable: string;
	noOfHHCsScreened: string;
	noOfHHCsWithTBSymptoms: string;
	noOfHHCsReferredTBTesting: string;
	noOfHHCsDiagnosedTB: string;
	noOfHHCsTBInitiatedATT: string;
	noOfHHCsUndergoneLTBITest: string;
	noOfEligibleForTPT: string;
	noOfHHCsInitiatedTPT: string;
}

export interface SettingsWrapperInterface {
	category: string;
	settings: SettingsInterface[];
}
export interface SettingsInterface {
	keyName: string;
	label: string;
	type: "text" | "longtext" | "number" | "time" | "chips" | "button" | "select";
	value: string;
	placeholder: string;
	endpoint: string | null;
}

export interface TeleCaller {
	createdBy: string;
	createdOn: string;
	dateOfJoining: string;
	email: string;
	firstName: string;
	gender: string;
	lastName: string;
	personId: number;
	phoneNumber: string;
	state: string;
	teleCallerId: number;
	updatedBy: string;
	dateOfLeaving: string;
}

export interface StateHead {
	createdBy: string;
	createdOn: string;
	dateOfJoining: string;
	email: string;
	firstName: string;
	gender: string;
	lastName: string;
	personId: number;
	phoneNumber: string;
	state: string;
	stateHeadId: number;
	updatedBy: string;
	dateOfLeaving: string;
}
