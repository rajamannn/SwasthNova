import { HealthCentre, ResourceTransfer, AlertNotification, InventoryItem, BedStatus, StaffAttendance, LabTest } from "../types";

export const initialCentres: HealthCentre[] = [
  {
    id: "centre-1",
    name: "District General Hospital, Alibag",
    location: "Alibag Town, Central District",
    type: "District Hospital",
    totalPatientsToday: 384,
    availableDoctors: 14,
    nursesOnDuty: 28,
    overallHealthScore: 92,
    coordinates: { x: 45, y: 55 },
    ambulanceStatus: "Available",
    vaccinationStatus: { vaccinatedToday: 145, targetToday: 150 },
    inventory: [
      { name: "Paracetamol 500mg", category: "Medicine", quantity: 8500, unit: "tablets", avgDailyConsumption: 350, daysRemaining: 24, criticalLevel: 1000, expiryDate: "2027-11-15" },
      { name: "Amoxicillin 250mg", category: "Medicine", quantity: 4200, unit: "capsules", avgDailyConsumption: 120, daysRemaining: 35, criticalLevel: 500, expiryDate: "2026-12-01" },
      { name: "COVID-19 Vaccine (Covaxin)", category: "Vaccine", quantity: 1800, unit: "vials", avgDailyConsumption: 40, daysRemaining: 45, criticalLevel: 200, expiryDate: "2026-10-10" },
      { name: "BCG Vaccine", category: "Vaccine", quantity: 950, unit: "vials", avgDailyConsumption: 15, daysRemaining: 63, criticalLevel: 100, expiryDate: "2027-02-28" },
      { name: "Adrenaline Injection", category: "Emergency Drug", quantity: 450, unit: "ampoules", avgDailyConsumption: 12, daysRemaining: 37, criticalLevel: 50, expiryDate: "2026-09-18" },
      { name: "Normal Saline 0.9%", category: "IV Fluid", quantity: 1200, unit: "bottles", avgDailyConsumption: 65, daysRemaining: 18, criticalLevel: 150, expiryDate: "2027-04-05" },
      { name: "Oxygen Cylinder (D-Type)", category: "Oxygen Cylinder", quantity: 94, unit: "units", avgDailyConsumption: 8, daysRemaining: 11, criticalLevel: 15, expiryDate: "2028-01-01" },
      { name: "PPE Kit", category: "PPE Kit", quantity: 3200, unit: "kits", avgDailyConsumption: 50, daysRemaining: 64, criticalLevel: 300, expiryDate: "2028-06-30" },
      { name: "Blood Unit (O Negative)", category: "Blood Unit", quantity: 28, unit: "bags", avgDailyConsumption: 2, daysRemaining: 14, criticalLevel: 5, expiryDate: "2026-08-12" },
      { name: "Blood Unit (B Positive)", category: "Blood Unit", quantity: 85, unit: "bags", avgDailyConsumption: 4, daysRemaining: 21, criticalLevel: 10, expiryDate: "2026-08-15" }
    ],
    beds: {
      icu: { total: 15, occupied: 12, available: 3 },
      emergency: { total: 20, occupied: 14, available: 6 },
      maternity: { total: 30, occupied: 22, available: 8 },
      isolation: { total: 25, occupied: 8, available: 17 }
    },
    labTests: [
      { id: "test-1", name: "Blood Complete Count", isAvailable: true, waitingTimeMin: 35, equipmentStatus: "Operational" },
      { id: "test-2", name: "X-Ray Chest", isAvailable: true, waitingTimeMin: 20, equipmentStatus: "Operational" },
      { id: "test-3", name: "CT Scan / MRI", isAvailable: true, waitingTimeMin: 90, equipmentStatus: "Operational" },
      { id: "test-4", name: "ECG", isAvailable: true, waitingTimeMin: 15, equipmentStatus: "Operational" },
      { id: "test-5", name: "Ultrasound", isAvailable: true, waitingTimeMin: 45, equipmentStatus: "Operational" },
      { id: "test-6", name: "COVID Rapid Antigen", isAvailable: true, waitingTimeMin: 10, equipmentStatus: "Operational" }
    ],
    attendance: [
      { id: "st-101", name: "Dr. Ramesh Patil", role: "Doctor", department: "Emergency", status: "Present", checkInTime: "08:45 AM", workingHours: 6.5 },
      { id: "st-102", name: "Dr. Sunita Sharma", role: "Doctor", department: "Gynaecology", status: "Present", checkInTime: "09:00 AM", workingHours: 6.0 },
      { id: "st-103", name: "Dr. Vinay Malhotra", role: "Doctor", department: "General OPD", status: "Late Arrival", checkInTime: "10:15 AM", workingHours: 4.5 },
      { id: "st-104", name: "Dr. Ananya Roy", role: "Doctor", department: "Pediatrics", status: "Present", checkInTime: "08:50 AM", workingHours: 6.5 },
      { id: "st-105", name: "Dr. Amit Deshmukh", role: "Doctor", department: "Emergency", status: "Absent" },
      { id: "st-106", name: "Staff Nurse Mary D'Souza", role: "Nurse", department: "Emergency", status: "Present", checkInTime: "07:30 AM", workingHours: 8.0 }
    ]
  },
  {
    id: "centre-2",
    name: "CHC Karjat",
    location: "Karjat Foothills, Eastern Block",
    type: "CHC",
    totalPatientsToday: 195,
    availableDoctors: 5,
    nursesOnDuty: 11,
    overallHealthScore: 84,
    coordinates: { x: 78, y: 35 },
    ambulanceStatus: "On Trip",
    vaccinationStatus: { vaccinatedToday: 62, targetToday: 80 },
    inventory: [
      { name: "Paracetamol 500mg", category: "Medicine", quantity: 4500, unit: "tablets", avgDailyConsumption: 160, daysRemaining: 28, criticalLevel: 800, expiryDate: "2027-09-20" },
      { name: "Amoxicillin 250mg", category: "Medicine", quantity: 1800, unit: "capsules", avgDailyConsumption: 70, daysRemaining: 25, criticalLevel: 300, expiryDate: "2026-11-10" },
      { name: "COVID-19 Vaccine (Covaxin)", category: "Vaccine", quantity: 820, unit: "vials", avgDailyConsumption: 22, daysRemaining: 37, criticalLevel: 100, expiryDate: "2026-11-05" },
      { name: "BCG Vaccine", category: "Vaccine", quantity: 40, unit: "vials", avgDailyConsumption: 8, daysRemaining: 5, criticalLevel: 50, expiryDate: "2026-08-15" }, // critical shortage soon
      { name: "Adrenaline Injection", category: "Emergency Drug", quantity: 80, unit: "ampoules", avgDailyConsumption: 4, daysRemaining: 20, criticalLevel: 15, expiryDate: "2026-09-01" },
      { name: "Normal Saline 0.9%", category: "IV Fluid", quantity: 380, unit: "bottles", avgDailyConsumption: 25, daysRemaining: 15, criticalLevel: 80, expiryDate: "2027-02-12" },
      { name: "Oxygen Cylinder (D-Type)", category: "Oxygen Cylinder", quantity: 18, unit: "units", avgDailyConsumption: 3, daysRemaining: 6, criticalLevel: 5, expiryDate: "2027-12-15" },
      { name: "PPE Kit", category: "PPE Kit", quantity: 800, unit: "kits", avgDailyConsumption: 15, daysRemaining: 53, criticalLevel: 100, expiryDate: "2028-04-10" },
      { name: "Blood Unit (O Negative)", category: "Blood Unit", quantity: 2, unit: "bags", avgDailyConsumption: 1, daysRemaining: 2, criticalLevel: 3, expiryDate: "2026-07-20" }, // critical
      { name: "Blood Unit (B Positive)", category: "Blood Unit", quantity: 12, unit: "bags", avgDailyConsumption: 1, daysRemaining: 12, criticalLevel: 4, expiryDate: "2026-07-28" }
    ],
    beds: {
      icu: { total: 4, occupied: 3, available: 1 },
      emergency: { total: 8, occupied: 7, available: 1 },
      maternity: { total: 15, occupied: 11, available: 4 },
      isolation: { total: 10, occupied: 4, available: 6 }
    },
    labTests: [
      { id: "test-1", name: "Blood Complete Count", isAvailable: true, waitingTimeMin: 45, equipmentStatus: "Operational" },
      { id: "test-2", name: "X-Ray Chest", isAvailable: true, waitingTimeMin: 30, equipmentStatus: "Operational" },
      { id: "test-3", name: "CT Scan / MRI", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-4", name: "ECG", isAvailable: true, waitingTimeMin: 20, equipmentStatus: "Operational" },
      { id: "test-5", name: "Ultrasound", isAvailable: true, waitingTimeMin: 50, equipmentStatus: "Operational" },
      { id: "test-6", name: "COVID Rapid Antigen", isAvailable: true, waitingTimeMin: 12, equipmentStatus: "Operational" }
    ],
    attendance: [
      { id: "st-201", name: "Dr. Rajesh Kadam", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "09:05 AM", workingHours: 6.0 },
      { id: "st-202", name: "Dr. Snehal More", role: "Doctor", department: "Gynaecology", status: "Present", checkInTime: "08:55 AM", workingHours: 6.0 },
      { id: "st-203", name: "Dr. K. Raghavan", role: "Doctor", department: "Pediatrics", status: "On Leave" },
      { id: "st-204", name: "Dr. Farhan Shaikh", role: "Doctor", department: "Emergency", status: "Present", checkInTime: "08:30 AM", workingHours: 6.5 },
      { id: "st-205", name: "Staff Nurse Kavita Mane", role: "Nurse", department: "General OPD", status: "Present", checkInTime: "08:00 AM", workingHours: 7.5 }
    ]
  },
  {
    id: "centre-3",
    name: "PHC Pen",
    location: "Pen Rural Junction",
    type: "PHC",
    totalPatientsToday: 112,
    availableDoctors: 1, // critical shortage
    nursesOnDuty: 3,
    overallHealthScore: 59, // Underperforming
    coordinates: { x: 30, y: 38 },
    ambulanceStatus: "Available",
    vaccinationStatus: { vaccinatedToday: 18, targetToday: 50 },
    inventory: [
      { name: "Paracetamol 500mg", category: "Medicine", quantity: 150, unit: "tablets", avgDailyConsumption: 85, daysRemaining: 1.7, criticalLevel: 500, expiryDate: "2027-08-10" }, // critical
      { name: "Amoxicillin 250mg", category: "Medicine", quantity: 240, unit: "capsules", avgDailyConsumption: 50, daysRemaining: 4.8, criticalLevel: 200, expiryDate: "2026-10-15" }, // critical
      { name: "COVID-19 Vaccine (Covaxin)", category: "Vaccine", quantity: 60, unit: "vials", avgDailyConsumption: 12, daysRemaining: 5, criticalLevel: 50, expiryDate: "2026-09-01" }, // critical
      { name: "BCG Vaccine", category: "Vaccine", quantity: 220, unit: "vials", avgDailyConsumption: 6, daysRemaining: 36, criticalLevel: 40, expiryDate: "2027-01-10" },
      { name: "Adrenaline Injection", category: "Emergency Drug", quantity: 8, unit: "ampoules", avgDailyConsumption: 2, daysRemaining: 4, criticalLevel: 10, expiryDate: "2026-08-30" }, // critical
      { name: "Normal Saline 0.9%", category: "IV Fluid", quantity: 45, unit: "bottles", avgDailyConsumption: 12, daysRemaining: 3.7, criticalLevel: 40, expiryDate: "2027-03-01" }, // critical
      { name: "Oxygen Cylinder (D-Type)", category: "Oxygen Cylinder", quantity: 2, unit: "units", avgDailyConsumption: 1, daysRemaining: 2, criticalLevel: 3, expiryDate: "2027-10-10" }, // critical
      { name: "PPE Kit", category: "PPE Kit", quantity: 180, unit: "kits", avgDailyConsumption: 8, daysRemaining: 22, criticalLevel: 50, expiryDate: "2028-02-15" },
      { name: "Blood Unit (O Negative)", category: "Blood Unit", quantity: 0, unit: "bags", avgDailyConsumption: 0.5, daysRemaining: 0, criticalLevel: 2, expiryDate: "2026-07-20" }, // stockout
      { name: "Blood Unit (B Positive)", category: "Blood Unit", quantity: 3, unit: "bags", avgDailyConsumption: 1, daysRemaining: 3, criticalLevel: 2, expiryDate: "2026-07-25" }
    ],
    beds: {
      icu: { total: 0, occupied: 0, available: 0 },
      emergency: { total: 2, occupied: 2, available: 0 }, // full
      maternity: { total: 6, occupied: 5, available: 1 },
      isolation: { total: 4, occupied: 1, available: 3 }
    },
    labTests: [
      { id: "test-1", name: "Blood Complete Count", isAvailable: true, waitingTimeMin: 65, equipmentStatus: "Operational" },
      { id: "test-2", name: "X-Ray Chest", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Under Maintenance" },
      { id: "test-3", name: "CT Scan / MRI", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-4", name: "ECG", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-5", name: "Ultrasound", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-6", name: "COVID Rapid Antigen", isAvailable: true, waitingTimeMin: 25, equipmentStatus: "Operational" }
    ],
    attendance: [
      { id: "st-301", name: "Dr. Megha Joshi", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "09:30 AM", workingHours: 5.5 },
      { id: "st-302", name: "Dr. Shridhar Kelkar", role: "Doctor", department: "General OPD", status: "Absent" }, // critical absence
      { id: "st-303", name: "Staff Nurse Asha Shinde", role: "Nurse", department: "General OPD", status: "Present", checkInTime: "08:15 AM", workingHours: 7.0 }
    ]
  },
  {
    id: "centre-4",
    name: "PHC Khalapur",
    location: "Khalapur Express Highway",
    type: "PHC",
    totalPatientsToday: 94,
    availableDoctors: 2,
    nursesOnDuty: 4,
    overallHealthScore: 78,
    coordinates: { x: 62, y: 22 },
    ambulanceStatus: "Under Maintenance",
    vaccinationStatus: { vaccinatedToday: 42, targetToday: 45 },
    inventory: [
      { name: "Paracetamol 500mg", category: "Medicine", quantity: 380, unit: "tablets", avgDailyConsumption: 75, daysRemaining: 5, criticalLevel: 400, expiryDate: "2027-08-05" }, // warning
      { name: "Amoxicillin 250mg", category: "Medicine", quantity: 900, unit: "capsules", avgDailyConsumption: 35, daysRemaining: 25, criticalLevel: 150, expiryDate: "2026-10-20" },
      { name: "COVID-19 Vaccine (Covaxin)", category: "Vaccine", quantity: 450, unit: "vials", avgDailyConsumption: 15, daysRemaining: 30, criticalLevel: 50, expiryDate: "2026-11-20" },
      { name: "BCG Vaccine", category: "Vaccine", quantity: 35, unit: "vials", avgDailyConsumption: 8, daysRemaining: 4.3, criticalLevel: 40, expiryDate: "2027-01-15" }, // warning
      { name: "Adrenaline Injection", category: "Emergency Drug", quantity: 24, unit: "ampoules", avgDailyConsumption: 1.5, daysRemaining: 16, criticalLevel: 10, expiryDate: "2026-09-12" },
      { name: "Normal Saline 0.9%", category: "IV Fluid", quantity: 180, unit: "bottles", avgDailyConsumption: 15, daysRemaining: 12, criticalLevel: 30, expiryDate: "2027-03-20" },
      { name: "Oxygen Cylinder (D-Type)", category: "Oxygen Cylinder", quantity: 5, unit: "units", avgDailyConsumption: 0.8, daysRemaining: 6.2, criticalLevel: 2, expiryDate: "2027-11-01" },
      { name: "PPE Kit", category: "PPE Kit", quantity: 410, unit: "kits", avgDailyConsumption: 10, daysRemaining: 41, criticalLevel: 40, expiryDate: "2028-03-01" },
      { name: "Blood Unit (O Negative)", category: "Blood Unit", quantity: 1, unit: "bags", avgDailyConsumption: 0.5, daysRemaining: 2, criticalLevel: 2, expiryDate: "2026-07-20" }, // warning
      { name: "Blood Unit (B Positive)", category: "Blood Unit", quantity: 6, unit: "bags", avgDailyConsumption: 0.8, daysRemaining: 7.5, criticalLevel: 2, expiryDate: "2026-07-26" }
    ],
    beds: {
      icu: { total: 0, occupied: 0, available: 0 },
      emergency: { total: 3, occupied: 1, available: 2 },
      maternity: { total: 5, occupied: 2, available: 3 },
      isolation: { total: 5, occupied: 0, available: 5 }
    },
    labTests: [
      { id: "test-1", name: "Blood Complete Count", isAvailable: true, waitingTimeMin: 25, equipmentStatus: "Operational" },
      { id: "test-2", name: "X-Ray Chest", isAvailable: true, waitingTimeMin: 15, equipmentStatus: "Operational" },
      { id: "test-3", name: "CT Scan / MRI", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-4", name: "ECG", isAvailable: true, waitingTimeMin: 15, equipmentStatus: "Operational" },
      { id: "test-5", name: "Ultrasound", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-6", name: "COVID Rapid Antigen", isAvailable: true, waitingTimeMin: 8, equipmentStatus: "Operational" }
    ],
    attendance: [
      { id: "st-401", name: "Dr. Nilesh Gaikwad", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "08:50 AM", workingHours: 6.0 },
      { id: "st-402", name: "Dr. Pooja Shinde", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "09:00 AM", workingHours: 6.0 },
      { id: "st-403", name: "Staff Nurse Shanti Kumar", role: "Nurse", department: "Emergency", status: "Present", checkInTime: "08:00 AM", workingHours: 7.5 }
    ]
  },
  {
    id: "centre-5",
    name: "PHC Uran",
    location: "Uran Coastal Hub",
    type: "PHC",
    totalPatientsToday: 138, // high load for PHC
    availableDoctors: 1,
    nursesOnDuty: 3,
    overallHealthScore: 68,
    coordinates: { x: 20, y: 65 },
    ambulanceStatus: "Available",
    vaccinationStatus: { vaccinatedToday: 31, targetToday: 40 },
    inventory: [
      { name: "Paracetamol 500mg", category: "Medicine", quantity: 180, unit: "tablets", avgDailyConsumption: 120, daysRemaining: 1.5, criticalLevel: 500, expiryDate: "2027-08-01" }, // critical dengue surge!
      { name: "Amoxicillin 250mg", category: "Medicine", quantity: 850, unit: "capsules", avgDailyConsumption: 40, daysRemaining: 21.2, criticalLevel: 150, expiryDate: "2026-11-25" },
      { name: "COVID-19 Vaccine (Covaxin)", category: "Vaccine", quantity: 280, unit: "vials", avgDailyConsumption: 10, daysRemaining: 28, criticalLevel: 50, expiryDate: "2026-11-15" },
      { name: "BCG Vaccine", category: "Vaccine", quantity: 380, unit: "vials", avgDailyConsumption: 6, daysRemaining: 63, criticalLevel: 40, expiryDate: "2027-01-30" },
      { name: "Adrenaline Injection", category: "Emergency Drug", quantity: 32, unit: "ampoules", avgDailyConsumption: 3, daysRemaining: 10.6, criticalLevel: 10, expiryDate: "2026-09-15" },
      { name: "Normal Saline 0.9%", category: "IV Fluid", quantity: 60, unit: "bottles", avgDailyConsumption: 22, daysRemaining: 2.7, criticalLevel: 30, expiryDate: "2027-03-15" }, // critical dehydration load!
      { name: "Oxygen Cylinder (D-Type)", category: "Oxygen Cylinder", quantity: 1, unit: "units", avgDailyConsumption: 0.9, daysRemaining: 1.1, criticalLevel: 3, expiryDate: "2027-10-15" }, // critical
      { name: "PPE Kit", category: "PPE Kit", quantity: 210, unit: "kits", avgDailyConsumption: 12, daysRemaining: 17.5, criticalLevel: 40, expiryDate: "2028-02-28" },
      { name: "Blood Unit (O Negative)", category: "Blood Unit", quantity: 2, unit: "bags", avgDailyConsumption: 0.5, daysRemaining: 4, criticalLevel: 2, expiryDate: "2026-07-21" },
      { name: "Blood Unit (B Positive)", category: "Blood Unit", quantity: 4, unit: "bags", avgDailyConsumption: 1.2, daysRemaining: 3.3, criticalLevel: 2, expiryDate: "2026-07-24" }
    ],
    beds: {
      icu: { total: 0, occupied: 0, available: 0 },
      emergency: { total: 4, occupied: 4, available: 0 }, // full
      maternity: { total: 6, occupied: 4, available: 2 },
      isolation: { total: 6, occupied: 5, available: 1 } // high load
    },
    labTests: [
      { id: "test-1", name: "Blood Complete Count", isAvailable: true, waitingTimeMin: 55, equipmentStatus: "Operational" },
      { id: "test-2", name: "X-Ray Chest", isAvailable: true, waitingTimeMin: 25, equipmentStatus: "Operational" },
      { id: "test-3", name: "CT Scan / MRI", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-4", name: "ECG", isAvailable: true, waitingTimeMin: 20, equipmentStatus: "Operational" },
      { id: "test-5", name: "Ultrasound", isAvailable: true, waitingTimeMin: 40, equipmentStatus: "Operational" },
      { id: "test-6", name: "COVID Rapid Antigen", isAvailable: true, waitingTimeMin: 15, equipmentStatus: "Operational" }
    ],
    attendance: [
      { id: "st-501", name: "Dr. Swati Deshpande", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "08:45 AM", workingHours: 6.5 },
      { id: "st-502", name: "Dr. Jayant Sinha", role: "Doctor", department: "Pediatrics", status: "Absent" }, // understaffed!
      { id: "st-503", name: "Staff Nurse Latha Nair", role: "Nurse", department: "Emergency", status: "Present", checkInTime: "07:45 AM", workingHours: 8.0 }
    ]
  },
  {
    id: "centre-6",
    name: "PHC Roha",
    location: "Roha Industrial Belt",
    type: "PHC",
    totalPatientsToday: 65,
    availableDoctors: 2,
    nursesOnDuty: 4,
    overallHealthScore: 89,
    coordinates: { x: 42, y: 82 },
    ambulanceStatus: "Available",
    vaccinationStatus: { vaccinatedToday: 25, targetToday: 30 },
    inventory: [
      { name: "Paracetamol 500mg", category: "Medicine", quantity: 1800, unit: "tablets", avgDailyConsumption: 40, daysRemaining: 45, criticalLevel: 250, expiryDate: "2027-09-10" },
      { name: "Amoxicillin 250mg", category: "Medicine", quantity: 1100, unit: "capsules", avgDailyConsumption: 25, daysRemaining: 44, criticalLevel: 150, expiryDate: "2026-11-20" },
      { name: "COVID-19 Vaccine (Covaxin)", category: "Vaccine", quantity: 600, unit: "vials", avgDailyConsumption: 8, daysRemaining: 75, criticalLevel: 50, expiryDate: "2026-11-30" },
      { name: "BCG Vaccine", category: "Vaccine", quantity: 410, unit: "vials", avgDailyConsumption: 4, daysRemaining: 102, criticalLevel: 40, expiryDate: "2027-02-15" },
      { name: "Adrenaline Injection", category: "Emergency Drug", quantity: 48, unit: "ampoules", avgDailyConsumption: 1, daysRemaining: 48, criticalLevel: 10, expiryDate: "2026-09-25" },
      { name: "Normal Saline 0.9%", category: "IV Fluid", quantity: 320, unit: "bottles", avgDailyConsumption: 10, daysRemaining: 32, criticalLevel: 30, expiryDate: "2027-04-10" },
      { name: "Oxygen Cylinder (D-Type)", category: "Oxygen Cylinder", quantity: 12, unit: "units", avgDailyConsumption: 0.5, daysRemaining: 24, criticalLevel: 2, expiryDate: "2027-11-15" },
      { name: "PPE Kit", category: "PPE Kit", quantity: 650, unit: "kits", avgDailyConsumption: 6, daysRemaining: 108, criticalLevel: 30, expiryDate: "2028-04-15" },
      { name: "Blood Unit (O Negative)", category: "Blood Unit", quantity: 4, unit: "bags", avgDailyConsumption: 0.2, daysRemaining: 20, criticalLevel: 1, expiryDate: "2026-07-22" },
      { name: "Blood Unit (B Positive)", category: "Blood Unit", quantity: 8, unit: "bags", avgDailyConsumption: 0.5, daysRemaining: 16, criticalLevel: 2, expiryDate: "2026-07-25" }
    ],
    beds: {
      icu: { total: 0, occupied: 0, available: 0 },
      emergency: { total: 3, occupied: 1, available: 2 },
      maternity: { total: 5, occupied: 2, available: 3 },
      isolation: { total: 5, occupied: 1, available: 4 }
    },
    labTests: [
      { id: "test-1", name: "Blood Complete Count", isAvailable: true, waitingTimeMin: 18, equipmentStatus: "Operational" },
      { id: "test-2", name: "X-Ray Chest", isAvailable: true, waitingTimeMin: 12, equipmentStatus: "Operational" },
      { id: "test-3", name: "CT Scan / MRI", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Down" },
      { id: "test-4", name: "ECG", isAvailable: true, waitingTimeMin: 10, equipmentStatus: "Operational" },
      { id: "test-5", name: "Ultrasound", isAvailable: false, waitingTimeMin: 0, equipmentStatus: "Under Maintenance" },
      { id: "test-6", name: "COVID Rapid Antigen", isAvailable: true, waitingTimeMin: 8, equipmentStatus: "Operational" }
    ],
    attendance: [
      { id: "st-601", name: "Dr. Kirti Kulkarni", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "08:55 AM", workingHours: 6.0 },
      { id: "st-602", name: "Dr. Sanjay Salunkhe", role: "Doctor", department: "General OPD", status: "Present", checkInTime: "09:00 AM", workingHours: 6.0 },
      { id: "st-603", name: "Staff Nurse Vidya Patil", role: "Nurse", department: "General OPD", status: "Present", checkInTime: "08:00 AM", workingHours: 7.5 }
    ]
  }
];

export const initialTransfers: ResourceTransfer[] = [
  {
    id: "tx-5001",
    item: "COVID-19 Vaccine (Covaxin)",
    quantity: 100,
    unit: "vials",
    fromCentreId: "centre-1",
    fromCentreName: "District General Hospital, Alibag",
    toCentreId: "centre-3",
    toCentreName: "PHC Pen",
    distanceKm: 28,
    status: "Completed",
    estimatedSavingsInr: 4500,
    timestamp: "2026-07-07 04:30 PM"
  },
  {
    id: "tx-5002",
    item: "Paracetamol 500mg",
    quantity: 1000,
    unit: "tablets",
    fromCentreId: "centre-1",
    fromCentreName: "District General Hospital, Alibag",
    toCentreId: "centre-5",
    toCentreName: "PHC Uran",
    distanceKm: 42,
    status: "In Transit",
    estimatedSavingsInr: 8200,
    timestamp: "2026-07-08 09:15 AM"
  }
];

// Helper to mathematically calculate performance score
export function calculatePerformanceScore(centre: HealthCentre): number {
  let score = 100;

  // 1. Medicine availability (weight 25)
  const totalItems = centre.inventory.length;
  const criticalItems = centre.inventory.filter(item => item.quantity < item.criticalLevel).length;
  const medicineScore = ((totalItems - criticalItems) / totalItems) * 25;
  score -= (25 - medicineScore);

  // 2. Doctor attendance (weight 25)
  const doctors = centre.attendance.filter(a => a.role === 'Doctor');
  if (doctors.length > 0) {
    const presentDoctors = doctors.filter(d => d.status === 'Present' || d.status === 'Late Arrival').length;
    const docAttendanceScore = (presentDoctors / doctors.length) * 25;
    score -= (25 - docAttendanceScore);
  } else {
    score -= 10; // penalty for no doctor pool at all
  }

  // 3. Bed Utilization (weight 20)
  let totalBedsAvailable = 0;
  let totalBedsOccupied = 0;
  Object.values(centre.beds).forEach(cat => {
    totalBedsAvailable += cat.available;
    totalBedsOccupied += cat.occupied;
  });
  const totalBeds = totalBedsAvailable + totalBedsOccupied;
  if (totalBeds > 0) {
    const utilizationRate = totalBedsOccupied / totalBeds;
    // Overutilization (>90%) or underutilization (<20%) reduces health score
    if (utilizationRate > 0.95) {
      score -= 8; // Overloaded capacity penalty
    } else if (utilizationRate < 0.15) {
      score -= 5; // Underutilized idle beds penalty
    }
  }

  // 4. Lab availability & Equipment (weight 15)
  const operationalLabs = centre.labTests.filter(t => t.equipmentStatus === 'Operational').length;
  const labScore = (operationalLabs / centre.labTests.length) * 15;
  score -= (15 - labScore);

  // 5. Patient Waiting Time (weight 15)
  let avgWaitingTime = 0;
  let count = 0;
  centre.labTests.forEach(t => {
    if (t.isAvailable) {
      avgWaitingTime += t.waitingTimeMin;
      count++;
    }
  });
  const avgWait = count > 0 ? avgWaitingTime / count : 30;
  if (avgWait > 50) {
    score -= 10; // high wait penalty
  } else if (avgWait > 30) {
    score -= 5;
  }

  // Round off
  return Math.max(10, Math.min(100, Math.round(score)));
}

// Generate active emergency notifications dynamically
export function getActiveAlerts(centres: HealthCentre[]): AlertNotification[] {
  const alerts: AlertNotification[] = [];
  let idCounter = 1;

  centres.forEach(centre => {
    // 1. Medicine Stock critical
    centre.inventory.forEach(item => {
      if (item.quantity === 0) {
        alerts.push({
          id: `alert-stock-${idCounter++}`,
          centreId: centre.id,
          centreName: centre.name,
          severity: "critical",
          category: "inventory",
          message: `${item.name} stockout detected! 0 ${item.unit} remaining.`,
          timestamp: "Just Now",
          isRead: false
        });
      } else if (item.quantity < item.criticalLevel) {
        alerts.push({
          id: `alert-stock-${idCounter++}`,
          centreId: centre.id,
          centreName: centre.name,
          severity: item.daysRemaining <= 3 ? "critical" : "warning",
          category: "inventory",
          message: `${item.name} is critically low: ${item.quantity} ${item.unit} (${Math.round(item.daysRemaining)} days left).`,
          timestamp: "Just Now",
          isRead: false
        });
      }
    });

    // 2. Staffing absence / shortage
    const doctors = centre.attendance.filter(a => a.role === 'Doctor');
    const presentDocs = doctors.filter(d => d.status === 'Present' || d.status === 'Late Arrival').length;
    if (presentDocs === 0 && doctors.length > 0) {
      alerts.push({
        id: `alert-staff-${idCounter++}`,
        centreId: centre.id,
        centreName: centre.name,
        severity: "critical",
        category: "staffing",
        message: `Emergency! Zero doctors are present at the centre today.`,
        timestamp: "5 mins ago",
        isRead: false
      });
    } else if (presentDocs === 1 && centre.totalPatientsToday > 100) {
      alerts.push({
        id: `alert-staff-${idCounter++}`,
        centreId: centre.id,
        centreName: centre.name,
        severity: "warning",
        category: "staffing",
        message: `High Patient Load Alert: Only 1 active doctor available for ${centre.totalPatientsToday} patients.`,
        timestamp: "12 mins ago",
        isRead: false
      });
    }

    // 3. Bed availability
    const emergencyBeds = centre.beds.emergency;
    if (emergencyBeds.total > 0 && emergencyBeds.available === 0) {
      alerts.push({
        id: `alert-bed-${idCounter++}`,
        centreId: centre.id,
        centreName: centre.name,
        severity: "critical",
        category: "beds",
        message: `Critical Bed Capacity: Emergency Ward is fully occupied.`,
        timestamp: "10 mins ago",
        isRead: false
      });
    }

    // 4. Lab equipment failures
    centre.labTests.forEach(test => {
      if (test.equipmentStatus === 'Down') {
        alerts.push({
          id: `alert-eq-${idCounter++}`,
          centreId: centre.id,
          centreName: centre.name,
          severity: "warning",
          category: "equipment",
          message: `Equipment failure detected for '${test.name}'. Tests are temporarily suspended.`,
          timestamp: "30 mins ago",
          isRead: false
        });
      }
    });

    // 5. Outbreak conditions (e.g. high fever/dengue caseload in coastal Uran)
    if (centre.id === "centre-5" && centre.totalPatientsToday > 120) {
      alerts.push({
        id: `alert-out-${idCounter++}`,
        centreId: centre.id,
        centreName: centre.name,
        severity: "critical",
        category: "outbreak",
        message: `Dengue & High-Fever spike: ${centre.totalPatientsToday} cases logged. Outbreak alert triggered.`,
        timestamp: "1 hour ago",
        isRead: false
      });
    }
  });

  return alerts;
}

// AI Shortage & Stock-Out warnings
export interface ShortageWarning {
  item: string;
  centreName: string;
  currentQty: number;
  avgDaily: number;
  daysLeft: number;
  severity: 'critical' | 'warning';
}

export function getShortagePredictions(centres: HealthCentre[]): ShortageWarning[] {
  const warnings: ShortageWarning[] = [];
  centres.forEach(c => {
    c.inventory.forEach(item => {
      if (item.daysRemaining <= 7) {
        warnings.push({
          item: item.name,
          centreName: c.name,
          currentQty: item.quantity,
          avgDaily: item.avgDailyConsumption,
          daysLeft: item.daysRemaining,
          severity: item.daysRemaining <= 3 ? 'critical' : 'warning'
        });
      }
    });
  });
  return warnings.sort((a, b) => a.daysLeft - b.daysLeft);
}

// AI Smart Resource Redistribution Algorithms
export function getSmartResourceRedistributions(centres: HealthCentre[]): Omit<ResourceTransfer, 'id' | 'status' | 'timestamp'>[] {
  const recommendations: Omit<ResourceTransfer, 'id' | 'status' | 'timestamp'>[] = [];
  const itemsToCheck = [
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "COVID-19 Vaccine (Covaxin)",
    "BCG Vaccine",
    "Adrenaline Injection",
    "Normal Saline 0.9%",
    "Oxygen Cylinder (D-Type)",
    "Blood Unit (O Negative)",
    "Blood Unit (B Positive)"
  ];

  itemsToCheck.forEach(itemName => {
    // 1. Identify deficit centres (< criticalLevel or <= 3 daysRemaining)
    const deficits: { centre: HealthCentre; item: InventoryItem; deficitQty: number }[] = [];
    const surpluses: { centre: HealthCentre; item: InventoryItem; surplusQty: number }[] = [];

    centres.forEach(c => {
      const match = c.inventory.find(i => i.name === itemName);
      if (match) {
        if (match.quantity < match.criticalLevel || match.daysRemaining <= 4) {
          // deficit: amount needed to reach safe 15-day stock or critical level
          const target = Math.max(match.criticalLevel, match.avgDailyConsumption * 15);
          const deficitQty = Math.ceil(target - match.quantity);
          if (deficitQty > 0) {
            deficits.push({ centre: c, item: match, deficitQty });
          }
        } else if (match.daysRemaining >= 15 && match.quantity > match.criticalLevel) {
          // surplus: amount we can share keeping at least 12-day supply or criticalLevel
          const safetyLimit = Math.max(match.criticalLevel, match.avgDailyConsumption * 12);
          const surplusQty = Math.floor(match.quantity - safetyLimit);
          if (surplusQty > 10) {
            surpluses.push({ centre: c, item: match, surplusQty });
          }
        }
      }
    });

    // 2. Match deficits to surpluses optimizing distance
    deficits.forEach(def => {
      // Find closest surplus
      let bestSurplus: typeof surpluses[0] | null = null;
      let minDistance = 999;

      surpluses.forEach(surp => {
        // Calculate coordinate distance
        const dx = def.centre.coordinates.x - surp.centre.coordinates.x;
        const dy = def.centre.coordinates.y - surp.centre.coordinates.y;
        const dist = Math.sqrt(dx * dx + dy * dy); // scale factor for km
        const distKm = Math.round(dist * 0.8); // map coordinates to ~50km district scale

        if (distKm < minDistance && surp.surplusQty > 0) {
          minDistance = distKm;
          bestSurplus = surp;
        }
      });

      if (bestSurplus && (bestSurplus as any).surplusQty > 0) {
        const transferQty = Math.min(def.deficitQty, (bestSurplus as any).surplusQty);
        
        // Deduct from surplus pool for next matches
        (bestSurplus as any).surplusQty -= transferQty;

        // Estimate savings in INR (cost of expedited freight, medicine waste prevention, healthcare optimization)
        const itemValMultiplier = itemName.includes("Vaccine") ? 350 : itemName.includes("Oxygen") ? 1500 : itemName.includes("Blood") ? 2000 : 8;
        const estimatedSavingsInr = Math.round(transferQty * itemValMultiplier + (50 - minDistance) * 100);

        recommendations.push({
          item: itemName,
          quantity: transferQty,
          unit: def.item.unit,
          fromCentreId: (bestSurplus as any).centre.id,
          fromCentreName: (bestSurplus as any).centre.name,
          toCentreId: def.centre.id,
          toCentreName: def.centre.name,
          distanceKm: Math.max(5, minDistance),
          estimatedSavingsInr: Math.max(1000, estimatedSavingsInr)
        });
      }
    });
  });

  return recommendations;
}

// AI Disease Outbreak watch forecasts
export interface OutbreakPrediction {
  id: string;
  disease: string;
  targetCentreId: string;
  targetCentreName: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  triggerFactors: string[];
  recommendedAction: string;
}

export function getOutbreakPredictions(centres: HealthCentre[]): OutbreakPrediction[] {
  return [
    {
      id: "out-01",
      disease: "Dengue & Malaria Hemorrhagic Fever",
      targetCentreId: "centre-5",
      targetCentreName: "PHC Uran",
      riskLevel: "High",
      confidenceScore: 94,
      triggerFactors: ["Monsoon coastal stagnancy", "Caseload surged 40% in last 72 hours", "Poor local mosquito fogging reports"],
      recommendedAction: "Pre-allocate 150 mosquito nets and dispatch rapid NS1 antigen testing kits. Clear stagnancy blocks within 2km of coastal wards."
    },
    {
      id: "out-02",
      disease: "Viral Dehydration & Heat Stroke Spike",
      targetCentreId: "centre-4",
      targetCentreName: "PHC Khalapur",
      riskLevel: "Medium",
      confidenceScore: 82,
      triggerFactors: ["Industrial heat pockets", "High highway traveler footfall", "Local water pipe contamination reports"],
      recommendedAction: "Establish a dedicated 2-bed Cold Ward. Pre-stage 500 packets of Oral Rehydration Salts (ORS) and Normal Saline bottles."
    },
    {
      id: "out-03",
      disease: "Acute Diarrheal Outbreak Watch",
      targetCentreId: "centre-3",
      targetCentreName: "PHC Pen",
      riskLevel: "High",
      confidenceScore: 89,
      triggerFactors: ["Sewer overflow under highway bridge", "Underperforming clean water metric at Pen Rural Junction", "0 bags of O-ve blood on-site"],
      recommendedAction: "Deploy mobile chlorination unit to Pen Rural Junction. Transfer adrenaline and blood units from Alibag Town hub immediately."
    }
  ];
}
