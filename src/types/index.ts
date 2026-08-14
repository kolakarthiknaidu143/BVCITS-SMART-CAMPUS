export type UserRole = 'student' | 'parent' | 'faculty' | 'admin' | 'recruiter' | 'trainer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt?: string;
}

export interface StudentProfile {
  _id: string;
  userId: User | string;
  rollNumber: string;
  department: string;
  semester: number;
  cgpa: number;
  attendancePercentage: number;
  parentUserId?: User | string;
  skills?: string[];
}

export interface ParentProfile {
  _id?: string;
  userId: User;
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  relationship?: string;
  studentRollNumber: string;
  student?: {
    name?: string;
    email?: string;
    phone?: string;
    rollNumber?: string;
    department?: string;
    semester?: number;
    cgpa?: number;
  } | null;
}

export interface FacultyProfile {
  _id?: string;
  userId?: User | string;
  name?: string;
  email?: string;
  employeeId: string;
  department: string;
  designation: string;
  phone?: string;
  assignedSubjects: string[];
}

export interface AttendanceRecord {
  _id?: string;
  studentUserId: string;
  subject: string;
  date: string;
  status: 'Present' | 'Absent';
  markedBy?: string;
}

export interface MarkRecord {
  _id?: string;
  studentUserId: string;
  subject: string;
  examType: 'Mid1' | 'Mid2' | 'Internal' | 'Semester';
  marksObtained: number;
  maxMarks: number;
}

export interface NoticeItem {
  _id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Placement' | 'Event' | 'General';
  audience: 'All' | 'Students' | 'Parents' | 'Faculty' | 'Recruiters' | 'Trainers';
  expiryDate?: string;
  createdBy?: { name: string; email: string } | string;
  createdAt: string;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  registrationStatus: 'Open' | 'Closed' | 'Invite-Only';
  createdAt: string;
}

export interface PlacementDrive {
  _id: string;
  recruiterUserId: string;
  companyName: string;
  companyLogo?: string;
  jobRole: string;
  package: string;
  location: string;
  eligibilityCGPA: number;
  departmentEligibility: string[];
  deadline: string;
  description: string;
  requirements: string[];
  createdAt: string;
}

export interface JobApplication {
  _id: string;
  placementId: PlacementDrive | string;
  studentUserId: User | string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  appliedAt: string;
  notes?: string;
}

export interface TrainingProgram {
  _id: string;
  trainerUserId: string;
  trainerName?: string;
  title: string;
  description: string;
  category?: string;
  duration: string;
  skills: string[];
  eligibility: string;
  resources: string[];
  enrolledStudents: string[];
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Placement' | 'Notice' | 'Event' | 'Attendance' | 'Exam' | 'Application' | 'Training';
  isRead: boolean;
  createdAt: string;
}

export interface DepartmentItem {
  _id: string;
  name: string;
  code: string;
  hodName: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface CourseItem {
  _id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  section?: string;
  studentCount?: number;
}

export interface TimetableSlot {
  _id?: string;
  day: string;
  time: string;
  subject: string;
  room: string;
  section: string;
  department: string;
  facultyUserId?: { name: string; email: string } | string;
}
