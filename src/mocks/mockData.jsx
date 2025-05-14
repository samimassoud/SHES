// src/mocks/mockData.js

export const users = [
    // Patients
    { id: "1001", password: "patient1001", role: "patient", name: "John Doe" },
    { id: "1002", password: "patient1002", role: "patient", name: "Sara Lee" },
  
    // Doctors
    { id: "2001", password: "doctor2001", role: "doctor", name: "Dr. Emily Rose", specialty: "Dermatologist" },
    { id: "2002", password: "doctor2002", role: "doctor", name: "Dr. Adam Blake", specialty: "Cardiologist" },
  
    // Admin
    { id: "3001", password: "admin3001", role: "admin", name: "Admin User" },
  
    // IT Staff
    { id: "4001", password: "it4001", role: "it", name: "IT Support" },
  ];
  
  export const appointments = [
    {
      id: 1,
      patientId: "1001",
      patientName: "John Doe",
      doctorId: "2001",
      doctorName: "Dr. Emily Rose",
      purpose: "Routine Checkup",
      date: "2024-07-06",
      daysLeft: 9,
      status: "upcoming",
    },
    {
      id: 2,
      patientId: "1002",
      patientName: "Sara Lee",
      doctorId: "2001",
      doctorName: "Dr. Adam Blake",
      purpose: "Follow-up Consultation",
      date: "2024-07-12",
      daysLeft: 15,
      status: "upcoming",
    },
    {
      id: 3,
      patientId: "1002",
      patientName: "Sara Lee",
      doctorId: "2001",
      doctorName: "Dr. Emily Rose",
      purpose: "Routine Checkup",
      date: "2024-07-06",
      daysLeft: 9,
      status: "upcoming",
    }
  ];
  
  export const doctors = [
    {
      id: "2001",
      name: "Dr. Emily Rose",
      specialty: "Dermatologist",
      joinDate: "2022-03-01",
      rating: 4.8,
    },
    {
      id: "2002",
      name: "Dr. Adam Blake",
      specialty: "Cardiologist",
      joinDate: "2021-08-15",
      rating: 4.9,
    },
  ];
  
  export const signupRequests = [
    {
      id: 1,
      nationalID: "12345678901234",
      email: "john.doe@example.com",
      requestDate: "2024-06-01",
      status: "pending",
    },
    {
      id: 2,
      nationalID: "56789012345678",
      email: "sara.lee@example.com",
      requestDate: "2024-06-03",
      status: "pending",
    },
  ];

  export const warehouseItems = [  
  {  
    ItemID: 1,  
    ItemName: "IV Fluids",  
    Category: "Medication",  
    QuantityInStock: 120,  
    ReorderThreshold: 200,  
    CriticalDuringEvents: ["Ramadan", "Eid al-Fitr"],  
    AverageMonthlyUsage: 150,  
    Unit: "Bottle",  
  },  
  // ...  
  {
    ItemID: 2,
    ItemName: "Surgical Masks",
    Category: "PPE",
    QuantityInStock: 500,
    ReorderThreshold: 300,
    CriticalDuringEvents: ["Ramadan", "Hajj Season"],
    AverageMonthlyUsage: 200,
    Unit: "Box",
  },
  {
    ItemID: 3,
    ItemName: "Antibiotics",
    Category: "Medication",
    QuantityInStock: 80,
    ReorderThreshold: 100,
    CriticalDuringEvents: ["Eid al-Adha"], // High injury rates during Eid
    AverageMonthlyUsage: 60,
    Unit: "Pack",
  },
];  

// Supplement Plans  
export const supplementPlans = [  
  {  
    PlanID: 1,
    ItemsInPlan: [
      { ItemID: 1, SuggestedQty: 250 }, // IV Fluids
      { ItemID: 2, SuggestedQty: 400 }, // Surgical Masks
    ],
    PlanType: "Quarterly",  
    StartDate: "2025-01-01",  
    EndDate: "2025-03-31",  
    IncludesEvents: true,  
    Status: "Draft",  
    ForecastModelUsed: "Seasonal AI v2",  
  },  
];  

// Event Calendar  
export const events = [  
  {  
    EventID: 1,  
    EventName: "Ramadan",  
    StartDate: "2025-03-01",  
    EndDate: "2025-03-30",  
    RecursAnnually: true,  
  },  
  {
    EventID: 2,
    EventName: "Eid al-Fitr",
    StartDate: "2025-03-31",
    EndDate: "2025-04-03",
    RecursAnnually: true,
  },
  {
    EventID: 3,
    EventName: "Hajj Season",
    StartDate: "2025-06-01",
    EndDate: "2025-06-15",
    RecursAnnually: true,
  },
  // ...  
];  

// Patient Feedback
export const patientFeedback = [
  {
    FeedbackID: 1,
    PatientID: "1001",
    DoctorID: "2001",
    Rating: 5,
    Comment: "Dr. Rose was very thorough.",
    Date: "2024-06-10",
  },
  {
    FeedbackID: 2,
    PatientID: "1002",
    DoctorID: "2002",
    Rating: 4,
    Comment: "Wait time was a bit long.",
    Date: "2024-06-15",
  },
];

export const approvalRequests = [
  {
    RequestID: 1,
    Type: "Absence",
    DoctorID: "2001",
    DoctorName: "Dr. Emily Rose",
    Dates: ["2025-07-10", "2025-07-11"],
    Status: "Pending",
  },
  {
    RequestID: 2,
    Type: "Supply Order",
    ItemID: 1, // IV Fluids
    Quantity: 100,
    RequestedBy: "4001", // IT Staff
    Status: "Pending",
  },
];

// Medical History (for MedicalHistorySection.jsx)
export const medicalHistory = [
  {
    RecordID: 1,
    PatientID: "1001",
    Date: "2024-01-15",
    Diagnosis: "Hypertension",
    Prescription: "Lisinopril 10mg daily",
    DoctorID: "2001"
  },
  {
    RecordID: 2,
    PatientID: "1001",
    Date: "2023-11-20",
    Diagnosis: "Common cold",
    Prescription: "Rest and fluids",
    DoctorID: "2002"
  }
];

// Localization (for LanguageSwitcher.jsx)
export const translations = {
  en: {
    welcome: "Welcome",
    inventory: "Inventory",
  },
  ar: {
    welcome: "مرحباً",
    inventory: "المخزون",
  },
};

export const feedbackQuestions = [
  "Was your doctor punctual?",
  "How would you rate the cleanliness?",
  "Were your concerns addressed?"
];

