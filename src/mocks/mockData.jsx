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
    },
    {
    id: 4,
    patientId: "1001",
    doctorId: "2001",
    status: "conflict", // New status
    conflictReason: "doctor_availability_change",
    originalDate: "2024-07-15",
    newAvailableSlots: [
      { date: "2024-07-14", time: "09:00" },
      { date: "2024-07-16", time: "11:00" }
    ]
  },
  {
    id: 5,
    patientId: "1002",
    doctorId: "2001",
    doctorName: "Dr. Emily Rose",
    date: "2024-07-11",
    status: "completed",
    delayed: true
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
    Rating: 3,
    Comment: "Wait time was a bit long.",
    Date: "2024-06-15",
  },
  {
    FeedbackID: 3,
    PatientID: "1001",
    DoctorID: "2001",
    Rating: 5,
    Comment: "Very thorough examination",
    Date: "2024-07-12"
  }
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
// src/translations/index.js
export const translations = {
  en: {
    home: "Home",
    about: "About",
    contact: "Contact",
    login: "Login",
    login_to_shes: "Login to SHES",
    id_number: "ID Number",
    enter_id: "Enter your ID",
    password: "Password",
    enter_password: "Enter your password",
    submit: "Submit",
    signup_prompt: "Don't have an account?",
    signup_link: "Sign up",
    about_title: "About SHES",
    about_content: [
      "The Smart Hospital Enhancement System (SHES) is designed to optimize hospital operations without replacing existing systems.",
      "SHES focuses on:",
      "By combining modern technology with gentle integration, SHES empowers hospitals to become smarter and more efficient.",
      "AI-powered Smart Scheduling",
        "Optimized Medical Inventory Management",
        "Doctor Performance Tracking & Evaluation",
        "Automated Workflow Approvals"
    ],
    contact_title: "Contact Us",
    contact_content: [
      "For questions or support about SHES, please reach out to our team.",
      "📧 Email: support@shes-hospital.com",
      "☎️ Phone: +123 456 7890",
      "Office Hours: Sunday - Thursday, 8:00 AM - 4:00 PM"
    ]

  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    contact: "اتصل بنا",
    login: "تسجيل الدخول",
    login_to_shes: "تسجيل الدخول إلى SHES",
    id_number: "رقم الحساب",
    enter_id: "أدخل رقم الحساب",
    password: "كلمة المرور",
    enter_password: "أدخل كلمة المرور",
    submit: "إرسال",
    signup_prompt: "ليس لديك حساب؟",
    signup_link: "سجل الآن",
    about_title: "عن نظام SHES",
    about_content: [
      "نظام تحسين المستشفى الذكي (شيز) مصمم لتحسين عمليات المستشفى دون استبدال الأنظمة الحالية.",
      "يركز SHES على:",
      "بدمج التكنولوجيا الحديثة مع التكامل السلس، يمكن شيز المستشفيات لتصبح أكثر ذكاءً وكفاءة.",
      "الجدولة الذكية بالذكاء الاصطناعي",
      "إدارة مخزون طبي محسنة",
      "تتبع وتقييم أداء الأطباء",
      "موافقات سير العمل الآلية"
    ],
    contact_title: "اتصل بنا",
    contact_content: [
      "للأسئلة أو الدعم الفني حول نظام شيز، يرجى التواصل مع فريقنا.",
      "📧 البريد الإلكتروني: support@shes-hospital.com",
      "☎️ الهاتف: +123 456 7890",
      "ساعات العمل: الأحد إلى الخميس، 8 صباحًا - 4 مساءً"
    ]
  }
};

export const feedbackQuestions = [
  "Was your doctor punctual?",
  "How would you rate the cleanliness?",
  "Were your concerns addressed?"
];

