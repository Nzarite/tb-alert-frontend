export interface VisitDataInterface {
  patient: PatientInterface;
  followUpDetails: FollowUpsDataInterface[];
}

export interface PatientInterface {
  patientId: string;
  personId: null;
  firstName: string;
  lastName: string;
  gender: string;
  age: null;
  phoneNumber: string;
  email: string;
  block: string;
  gp: string;
  village: string;
  district: string;
  state: string;
  currentStatus: string;
  cured: false;
  createdAt: string;
  createdBy: string;
  updatedBy: null;
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
