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

export interface SettingListItemProps {
	keyName: string;
	value: string;
	type: string;
	settings: SettingType[];
	getSettings: () => void;
	setSettings: React.Dispatch<React.SetStateAction<SettingType[]>>
  }

  export interface SettingStringItemProps {
	keyName: string;
	value: string;
	type: string;
	settings: SettingType[];
	getSettings: () => void;
	setSettings: React.Dispatch<React.SetStateAction<SettingType[]>>
  }

  export interface DBEntryType {
	id: string,
	name:string
  }

  export interface SettingType {
	keyName: string;
	value: string;
	type: string;
  }
