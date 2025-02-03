export interface VisitDataInterface {
	patient: PatientInterface;
	followUps: FollowUpsDataInterface[];
}

export interface PatientInterface {
	id: number;
	firstname: string;
	lastname?: string;
}

export interface FollowUpsDataInterface {
	id: number;
	date: string;
	filled: boolean;
	recoveryStatus: string | null;
	medications: MedicationInterface[];
}

export interface MedicationInterface {
	id: number;
	nameOfMedicine: string;
	missedDosage: number;
	comment: string;
}
