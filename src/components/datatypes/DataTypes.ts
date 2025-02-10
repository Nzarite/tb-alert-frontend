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
	size: string;
}
