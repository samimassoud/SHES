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