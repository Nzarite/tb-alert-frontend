export interface VisitDataInterface {
	patient: PatientInterface;
	followUpDetails: FollowUpsDataInterface[];
}

export interface PatientInterface {
	patientId: number;
	firstName: string;
	lastName: string;
	gender: string;
	dateOfBirth: string;
	phone: string;
	block: string;
	gp: string;
	village: string;
	district: string;
	currentStatus: boolean;
	cured: boolean;
	aliveOrDead: boolean;
}

export interface FollowUpsDataInterface {
	date: string;
	followUpStatus: boolean;
	remarks: string | null;
	patientCondition: number;
	medicationDetails: MedicationInterface[] | [];
}

export interface MedicationInterface {
	medicationId: number;
	medicationName: string;
	missedDosages: string;
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

export interface DashboardFieldsProp {
	name: string;
	label: string;
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
