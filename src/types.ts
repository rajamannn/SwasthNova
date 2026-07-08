export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'mr' | 'gu' | 'pa' | 'bn';

export type UserRole = 'DistrictAdmin' | 'PHCAdmin' | 'Doctor' | 'LabTech';

export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[]; // Multiple roles support!
  district?: string;
  healthCentre?: string;
  department?: string;
  permissions?: string[];
  language?: Language;
  status?: 'active' | 'inactive';
  photoURL?: string;
  lastLogin?: string;
  phoneNumber?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  isOnboarded?: boolean;
}

export type CentreType = 'PHC' | 'CHC' | 'District Hospital';

export interface InventoryItem {
  name: string;
  category: 'Medicine' | 'Vaccine' | 'Emergency Drug' | 'IV Fluid' | 'Medical Equipment' | 'PPE Kit' | 'Oxygen Cylinder' | 'Blood Unit';
  quantity: number;
  unit: string;
  avgDailyConsumption: number;
  daysRemaining: number;
  criticalLevel: number; // threshold below which item is critical
  expiryDate: string; // YYYY-MM-DD
}

export interface BedCategory {
  total: number;
  occupied: number;
  available: number;
}

export interface BedStatus {
  icu: BedCategory;
  emergency: BedCategory;
  maternity: BedCategory;
  isolation: BedCategory;
}

export interface StaffAttendance {
  id: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Lab Technician' | 'Pharmacist';
  department: 'Emergency' | 'General OPD' | 'Pediatrics' | 'Gynaecology' | 'Lab Services';
  status: 'Present' | 'Absent' | 'On Leave' | 'Late Arrival';
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
}

export interface LabTest {
  id: string;
  name: string;
  isAvailable: boolean;
  waitingTimeMin: number;
  equipmentStatus: 'Operational' | 'Under Maintenance' | 'Down';
}

export interface HealthCentre {
  id: string;
  name: string;
  location: string;
  type: CentreType;
  totalPatientsToday: number;
  availableDoctors: number;
  nursesOnDuty: number;
  overallHealthScore: number;
  coordinates: { x: number; y: number }; // Relative percentage for map plotting (0-100)
  inventory: InventoryItem[];
  beds: BedStatus;
  attendance: StaffAttendance[];
  labTests: LabTest[];
  ambulanceStatus: 'Available' | 'On Trip' | 'Under Maintenance';
  vaccinationStatus: {
    vaccinatedToday: number;
    targetToday: number;
  };
}

export interface ResourceTransfer {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  fromCentreId: string;
  fromCentreName: string;
  toCentreId: string;
  toCentreName: string;
  distanceKm: number;
  status: 'Pending' | 'Approved' | 'In Transit' | 'Completed';
  estimatedSavingsInr: number;
  timestamp: string;
}

export interface AlertNotification {
  id: string;
  centreId: string;
  centreName: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'inventory' | 'beds' | 'staffing' | 'equipment' | 'outbreak';
  message: string;
  timestamp: string;
  isRead: boolean;
}
