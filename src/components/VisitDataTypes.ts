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
	currentStatus: string;
}

export interface FollowUpsDataInterface {
	date: string;
	followUpStatus: boolean;
	remarks: string | null;
	medicationDetails: MedicationInterface[] | [];
}

export interface MedicationInterface {
	medicationId: number;
	medicationName: string;
	missedDosages: number;
	comments: string;
}
