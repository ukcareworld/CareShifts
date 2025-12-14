export enum UserRole {
  CARE_HOME = 'CARE_HOME',
  WORKER = 'WORKER',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ShiftStatus {
  OPEN = 'OPEN',
  PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
  BOOKED = 'BOOKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED_PENDING_APPROVAL = 'COMPLETED_PENDING_APPROVAL',
  CLOSED = 'CLOSED'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar: string;
  location: string;
  rating: number;
  totalRatings: number;
  approved?: boolean; // For Admin verification workflow
  // Care Home specific optional fields
  description?: string;
  careType?: string;
  hasParking?: boolean;
  // New Contact & Location fields
  contactPerson?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  postCode?: string;
}

export interface WorkerProfile extends User {
  bio: string;
  hourlyRate: number;
  documents: {
    name: string;
    verified: boolean;
    type: 'ID' | 'DBS' | 'CERTIFICATE';
  }[];
  skills: string[];
  drivingLicenceNumber?: string;
  visaStatus?: string;
  gender?: string;
  ethnicity?: string;
}

export interface Shift {
  id: string;
  careHomeId: string;
  careHomeName: string;
  workerId?: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationHours: number;
  hourlyRate: number;
  status: ShiftStatus;
  location: string;
  feedback?: {
    homeToWorker?: number;
    homeToWorkerComment?: string;
    workerToHome?: number;
    workerToHomeComment?: string;
  };
}

export interface AppState {
  currentUser: User | WorkerProfile | null;
  shifts: Shift[];
  workers: WorkerProfile[];
  users: User[]; // Base users (Care homes mostly)
}