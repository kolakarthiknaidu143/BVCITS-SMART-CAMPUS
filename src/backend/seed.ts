import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Student } from './models/Student';
import { Parent } from './models/Parent';
import { Faculty } from './models/Faculty';
import { Department } from './models/Department';
import { Course } from './models/Course';
import { Attendance } from './models/Attendance';
import { Marks } from './models/Marks';
import { Notice } from './models/Notice';
import { Event } from './models/Event';
import { Placement } from './models/Placement';
import { Application } from './models/Application';
import { Training } from './models/Training';
import { Notification } from './models/Notification';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('🌱 Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Starting database seeding for BVCITS Smart Campus...');

    // Hash passwords securely with bcrypt
    const passwordHash = await bcrypt.hash('student123', 10);
    const parentHash = await bcrypt.hash('parent123', 10);
    const facultyHash = await bcrypt.hash('faculty123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);
    const recruiterHash = await bcrypt.hash('recruiter123', 10);
    const trainerHash = await bcrypt.hash('trainer123', 10);

    // 1. Create Users
    const studentUser = await User.create({
      name: 'Karthik Naidu',
      email: 'student@bvcits.edu.in',
      password: passwordHash,
      role: 'student',
      phone: '+91 98765 43210',
    });

    const parentUser = await User.create({
      name: 'Ramesh Naidu',
      email: 'parent@bvcits.edu.in',
      password: parentHash,
      role: 'parent',
      phone: '+91 98765 11223',
    });

    const facultyUser = await User.create({
      name: 'Dr. Srinivas Rao',
      email: 'faculty@bvcits.edu.in',
      password: facultyHash,
      role: 'faculty',
      phone: '+91 94401 23456',
    });

    const adminUser = await User.create({
      name: 'Dr. V. S. Murthy (Director)',
      email: 'admin@bvcits.edu.in',
      password: adminHash,
      role: 'admin',
      phone: '+91 88800 99999',
    });

    const recruiterUser = await User.create({
      name: 'Ananya Sharma',
      email: 'recruiter@bvcits.edu.in',
      password: recruiterHash,
      role: 'recruiter',
      phone: '+91 91234 56789',
    });

    const trainerUser = await User.create({
      name: 'Vikramaditya Varma',
      email: 'trainer@bvcits.edu.in',
      password: trainerHash,
      role: 'trainer',
      phone: '+91 99887 76655',
    });

    // 2. Create Student Profile
    const studentProfile = await Student.create({
      userId: studentUser._id,
      rollNumber: '21BVC0501',
      department: 'Computer Science & Engineering',
      semester: 6,
      cgpa: 8.85,
      attendancePercentage: 91,
      parentUserId: parentUser._id,
      skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Data Structures', 'MongoDB'],
    });

    // 3. Create Parent Profile
    await Parent.create({
      userId: parentUser._id,
      studentRollNumber: '21BVC0501',
      studentUserId: studentUser._id,
      occupation: 'Senior Engineer',
    });

    // 4. Create Faculty Profile
    await Faculty.create({
      userId: facultyUser._id,
      employeeId: 'EMP0102',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor & HOD',
      assignedSubjects: ['Data Structures & Algorithms', 'Full-Stack Web Development', 'Artificial Intelligence'],
    });

    // 5. Create Departments
    await Department.create([
      { name: 'Computer Science & Engineering', code: 'CSE', hodName: 'Dr. Srinivas Rao', totalStudents: 480, totalFaculty: 24 },
      { name: 'Electronics & Communication', code: 'ECE', hodName: 'Dr. K. V. Ramana', totalStudents: 360, totalFaculty: 18 },
      { name: 'Electrical & Electronics', code: 'EEE', hodName: 'Dr. M. S. Kumar', totalStudents: 240, totalFaculty: 12 },
      { name: 'Mechanical Engineering', code: 'MECH', hodName: 'Dr. P. Satyanarayana', totalStudents: 300, totalFaculty: 15 },
      { name: 'Civil Engineering', code: 'CIVIL', hodName: 'Dr. B. Prasad', totalStudents: 180, totalFaculty: 10 },
    ]);

    // 6. Create Courses
    await Course.create([
      { code: 'CS301', name: 'Data Structures & Algorithms', department: 'Computer Science & Engineering', semester: 6, credits: 4, facultyUserId: facultyUser._id },
      { code: 'CS302', name: 'Full-Stack Web Development', department: 'Computer Science & Engineering', semester: 6, credits: 3, facultyUserId: facultyUser._id },
      { code: 'CS303', name: 'Artificial Intelligence & ML', department: 'Computer Science & Engineering', semester: 6, credits: 4, facultyUserId: facultyUser._id },
      { code: 'CS304', name: 'Database Management Systems', department: 'Computer Science & Engineering', semester: 6, credits: 3, facultyUserId: facultyUser._id },
    ]);

    // 7. Create Attendance Records
    const todayStr = new Date().toISOString().split('T')[0];
    const prevDate1 = new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0];
    const prevDate2 = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

    await Attendance.create([
      { studentUserId: studentUser._id, subject: 'Data Structures & Algorithms', date: todayStr, status: 'Present', markedBy: facultyUser._id },
      { studentUserId: studentUser._id, subject: 'Full-Stack Web Development', date: todayStr, status: 'Present', markedBy: facultyUser._id },
      { studentUserId: studentUser._id, subject: 'Artificial Intelligence & ML', date: prevDate1, status: 'Present', markedBy: facultyUser._id },
      { studentUserId: studentUser._id, subject: 'Database Management Systems', date: prevDate2, status: 'Present', markedBy: facultyUser._id },
    ]);

    // 8. Create Marks Records
    await Marks.create([
      { studentUserId: studentUser._id, subject: 'Data Structures & Algorithms', examType: 'Mid1', marksObtained: 28, maxMarks: 30, facultyUserId: facultyUser._id },
      { studentUserId: studentUser._id, subject: 'Full-Stack Web Development', examType: 'Mid1', marksObtained: 29, maxMarks: 30, facultyUserId: facultyUser._id },
      { studentUserId: studentUser._id, subject: 'Artificial Intelligence & ML', examType: 'Mid1', marksObtained: 27, maxMarks: 30, facultyUserId: facultyUser._id },
      { studentUserId: studentUser._id, subject: 'Database Management Systems', examType: 'Mid1', marksObtained: 26, maxMarks: 30, facultyUserId: facultyUser._id },
    ]);

    // 9. Create Notices
    await Notice.create([
      {
        title: 'BVCITS Annual Campus Recruitment Drive 2026',
        description: 'TCS, Infosys, and Accenture on-campus placement drives will commence from next Monday. All eligible 6th & 8th semester students must keep their resumes updated.',
        category: 'Placement',
        audience: 'All',
        createdBy: adminUser._id,
      },
      {
        title: 'Mid-Semester Examination Schedule Announced',
        description: 'Mid-2 Examinations for 3rd and 4th year B.Tech students will commence from March 5th. Detailed timetable is published in the student portal.',
        category: 'Academic',
        audience: 'Students',
        createdBy: facultyUser._id,
      },
      {
        title: 'Parent-Teacher Interaction Meet (PTM 2026)',
        description: 'BVCITS invites all parents for the biannual PTM on Saturday. Individual student progress reports and attendance records will be presented.',
        category: 'General',
        audience: 'Parents',
        createdBy: adminUser._id,
      },
    ]);

    // 10. Create Events
    await Event.create([
      {
        title: 'HackCampus 2026: 24-Hour Hackathon',
        description: 'Build innovative smart campus solutions using Web3, AI, and IoT. Prizes worth ₹1,50,000 up for grabs!',
        date: '2026-03-12',
        time: '09:00 AM IST',
        venue: 'Auditorium Block A',
        organizer: 'Department of CSE & Innovation Cell',
        registrationStatus: 'Open',
      },
      {
        title: 'Industry Connect Workshop: Full-Stack Cloud Architecture',
        description: 'Special hands-on workshop conducted by TechCorp Senior Solutions Architects on AWS, Docker, and Kubernetes.',
        date: '2026-03-18',
        time: '02:00 PM IST',
        venue: 'Lab 4, CSE Block',
        organizer: 'Training & Placement Cell',
        registrationStatus: 'Open',
      },
    ]);

    // 11. Create Placement Drives
    const placementDrive1 = await Placement.create({
      recruiterUserId: recruiterUser._id,
      companyName: 'TechCorp Solutions',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      jobRole: 'Software Development Engineer - I',
      package: '12.5 LPA',
      location: 'Hyderabad / Bangalore',
      eligibilityCGPA: 7.5,
      departmentEligibility: ['Computer Science & Engineering', 'Electronics & Communication'],
      deadline: '2026-03-25',
      description: 'Looking for sharp problem solvers with solid proficiency in Data Structures, React, Node.js, and cloud architecture fundamentals.',
      requirements: ['B.Tech 2026 passing batch', 'No active backlogs', 'Min 75% in 10th and 12th'],
    });

    const placementDrive2 = await Placement.create({
      recruiterUserId: recruiterUser._id,
      companyName: 'Infosys Specialist Programmer',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=60',
      jobRole: 'Systems Engineer Specialist',
      package: '9.5 LPA',
      location: 'Hyderabad',
      eligibilityCGPA: 7.0,
      departmentEligibility: ['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics'],
      deadline: '2026-03-30',
      description: 'Role involves full-stack software development, REST API design, microservices architecture, and database management.',
      requirements: ['B.Tech All branches', 'CGPA >= 7.0'],
    });

    // 12. Create Job Applications
    await Application.create({
      placementId: placementDrive1._id,
      studentUserId: studentUser._id,
      status: 'Shortlisted',
      notes: 'Profile shortlisted for Technical Round 1 on March 15.',
    });

    // 13. Create Training Programs
    const trainingProg = await Training.create({
      trainerUserId: trainerUser._id,
      trainerName: 'Vikramaditya Varma',
      title: 'Advanced Full-Stack Web Development Bootcamp',
      description: 'Comprehensive 6-week intensive training covering React, Node.js, Express, MongoDB, TypeScript, and AWS deployment.',
      category: 'Full Stack Web Development',
      duration: '6 Weeks (40 Hours)',
      startDate: '2026-03-01',
      venue: 'Computer Lab 3, CSE Block',
      maxSeats: 60,
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Docker'],
      eligibility: 'Open to all CSE, ECE, EEE 3rd & 4th Year Students',
      status: 'In Progress',
      resources: ['https://github.com/bvcits/fullstack-bootcamp-2026', 'https://docs.bvcits.edu.in/web-dev-deck.pdf'],
      modules: [
        { title: 'Module 1: React & Modern TypeScript Concepts', completed: true },
        { title: 'Module 2: Node.js Express Backend & REST APIs', completed: true },
        { title: 'Module 3: MongoDB Atlas Integration & Mongoose ORM', completed: true },
        { title: 'Module 4: Authentication, JWT & RBAC Security', completed: false },
        { title: 'Module 5: AWS Cloud Run & Containerized Deployment', completed: false },
      ],
      enrolledStudents: [studentUser._id],
      participantProgress: [
        {
          studentUserId: studentUser._id,
          progressPercentage: 65,
          attendanceCount: 8,
          totalSessions: 10,
          status: 'In Progress',
          grade: 'A+',
          notes: 'Excellent performance in React & Node.js practical labs.',
          updatedAt: new Date(),
        },
      ],
    });

    // 14. Create Initial Notifications
    await Notification.create([
      {
        userId: studentUser._id,
        title: 'Application Shortlisted!',
        message: 'Congratulations! You have been shortlisted for TechCorp Solutions SDE-I position.',
        type: 'Application',
        isRead: false,
      },
      {
        userId: studentUser._id,
        title: 'New Placement Drive Posted',
        message: 'Infosys Specialist Programmer drive is now accepting applications.',
        type: 'Placement',
        isRead: false,
      },
      {
        userId: parentUser._id,
        title: 'Weekly Academic Attendance Report',
        message: 'Your child Karthik Naidu (21BVC0501) maintained 91% attendance this week.',
        type: 'Attendance',
        isRead: false,
      },
      {
        userId: facultyUser._id,
        title: 'Class Attendance Logged',
        message: 'Data Structures attendance successfully submitted for CSE 6th Semester.',
        type: 'Attendance',
        isRead: true,
      },
    ]);

    console.log('✅ Database seeded successfully with demo accounts for all 6 roles!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
