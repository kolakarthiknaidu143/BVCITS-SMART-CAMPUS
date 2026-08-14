import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Student Portal Layout & Pages
import { StudentLayout } from './components/student/StudentLayout';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentMarksPage } from './pages/student/StudentMarksPage';
import { StudentTimetablePage } from './pages/student/StudentTimetablePage';
import { StudentPlacementsPage } from './pages/student/StudentPlacementsPage';
import { StudentTrainingPage } from './pages/student/StudentTrainingPage';
import { StudentNoticesPage } from './pages/student/StudentNoticesPage';
import { StudentEventsPage } from './pages/student/StudentEventsPage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';

// Parent Portal Layout & Pages
import { ParentLayout } from './components/parent/ParentLayout';
import { ParentDashboardPage } from './pages/parent/ParentDashboardPage';
import { ParentProfilePage } from './pages/parent/ParentProfilePage';
import { ParentAttendancePage } from './pages/parent/ParentAttendancePage';
import { ParentMarksPage } from './pages/parent/ParentMarksPage';
import { ParentTimetablePage } from './pages/parent/ParentTimetablePage';
import { ParentPlacementsPage } from './pages/parent/ParentPlacementsPage';
import { ParentTrainingPage } from './pages/parent/ParentTrainingPage';
import { ParentNoticesPage } from './pages/parent/ParentNoticesPage';
import { ParentEventsPage } from './pages/parent/ParentEventsPage';
import { ParentNotificationsPage } from './pages/parent/ParentNotificationsPage';

// Faculty Portal Layout & Pages
import { FacultyLayout } from './components/faculty/FacultyLayout';
import { FacultyDashboardPage } from './pages/faculty/FacultyDashboardPage';
import { FacultyProfilePage } from './pages/faculty/FacultyProfilePage';
import { FacultySubjectsPage } from './pages/faculty/FacultySubjectsPage';
import { FacultyStudentsPage } from './pages/faculty/FacultyStudentsPage';
import { FacultyAttendancePage } from './pages/faculty/FacultyAttendancePage';
import { FacultyMarksPage } from './pages/faculty/FacultyMarksPage';
import { FacultyTimetablePage } from './pages/faculty/FacultyTimetablePage';
import { FacultyNoticesPage } from './pages/faculty/FacultyNoticesPage';
import { FacultyEventsPage } from './pages/faculty/FacultyEventsPage';
import { FacultyNotificationsPage } from './pages/faculty/FacultyNotificationsPage';

// Admin Portal Layout & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminFacultyPage } from './pages/admin/AdminFacultyPage';
import { AdminParentsPage } from './pages/admin/AdminParentsPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminAttendancePage } from './pages/admin/AdminAttendancePage';
import { AdminMarksPage } from './pages/admin/AdminMarksPage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminPlacementsPage } from './pages/admin/AdminPlacementsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminTrainingPage } from './pages/admin/AdminTrainingPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Recruiter Portal Layout & Pages
import { RecruiterLayout } from './components/recruiter/RecruiterLayout';
import { RecruiterDashboardPage } from './pages/recruiter/RecruiterDashboardPage';
import { RecruiterProfilePage } from './pages/recruiter/RecruiterProfilePage';
import { RecruiterJobsPage } from './pages/recruiter/RecruiterJobsPage';
import { RecruiterApplicationsPage } from './pages/recruiter/RecruiterApplicationsPage';
import { RecruiterShortlistedPage } from './pages/recruiter/RecruiterShortlistedPage';
import { RecruiterInterviewsPage } from './pages/recruiter/RecruiterInterviewsPage';
import { RecruiterEventsPage } from './pages/recruiter/RecruiterEventsPage';
import { RecruiterNotificationsPage } from './pages/recruiter/RecruiterNotificationsPage';

// Trainer Portal Layout & Pages
import { TrainerLayout } from './components/trainer/TrainerLayout';
import { TrainerDashboardPage } from './pages/trainer/TrainerDashboardPage';
import { TrainerTrainingsPage } from './pages/trainer/TrainerTrainingsPage';
import { TrainerParticipantsPage } from './pages/trainer/TrainerParticipantsPage';
import { TrainerNotificationsPage } from './pages/trainer/TrainerNotificationsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Authentication Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Portal Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="attendance" element={<StudentAttendancePage />} />
            <Route path="marks" element={<StudentMarksPage />} />
            <Route path="timetable" element={<StudentTimetablePage />} />
            <Route path="placements" element={<StudentPlacementsPage />} />
            <Route path="training" element={<StudentTrainingPage />} />
            <Route path="notices" element={<StudentNoticesPage />} />
            <Route path="events" element={<StudentEventsPage />} />
            <Route path="notifications" element={<StudentNotificationsPage />} />
            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Route>

          {/* Parent Portal Protected Routes */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={['parent', 'admin']}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="dashboard" element={<ParentDashboardPage />} />
            <Route path="profile" element={<ParentProfilePage />} />
            <Route path="attendance" element={<ParentAttendancePage />} />
            <Route path="marks" element={<ParentMarksPage />} />
            <Route path="timetable" element={<ParentTimetablePage />} />
            <Route path="placements" element={<ParentPlacementsPage />} />
            <Route path="training" element={<ParentTrainingPage />} />
            <Route path="notices" element={<ParentNoticesPage />} />
            <Route path="events" element={<ParentEventsPage />} />
            <Route path="notifications" element={<ParentNotificationsPage />} />
            <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
          </Route>

          {/* Faculty Portal Protected Routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <FacultyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboardPage />} />
            <Route path="profile" element={<FacultyProfilePage />} />
            <Route path="subjects" element={<FacultySubjectsPage />} />
            <Route path="students" element={<FacultyStudentsPage />} />
            <Route path="attendance" element={<FacultyAttendancePage />} />
            <Route path="marks" element={<FacultyMarksPage />} />
            <Route path="timetable" element={<FacultyTimetablePage />} />
            <Route path="notices" element={<FacultyNoticesPage />} />
            <Route path="events" element={<FacultyEventsPage />} />
            <Route path="notifications" element={<FacultyNotificationsPage />} />
            <Route path="*" element={<Navigate to="/faculty/dashboard" replace />} />
          </Route>

          {/* Admin Portal Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="faculty" element={<AdminFacultyPage />} />
            <Route path="parents" element={<AdminParentsPage />} />
            <Route path="departments" element={<AdminDepartmentsPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
            <Route path="marks" element={<AdminMarksPage />} />
            <Route path="notices" element={<AdminNoticesPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="placements" element={<AdminPlacementsPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="training" element={<AdminTrainingPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Recruiter Portal Protected Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterDashboardPage />} />
            <Route path="profile" element={<RecruiterProfilePage />} />
            <Route path="jobs" element={<RecruiterJobsPage />} />
            <Route path="applications" element={<RecruiterApplicationsPage />} />
            <Route path="shortlisted" element={<RecruiterShortlistedPage />} />
            <Route path="interviews" element={<RecruiterInterviewsPage />} />
            <Route path="events" element={<RecruiterEventsPage />} />
            <Route path="notifications" element={<RecruiterNotificationsPage />} />
            <Route path="*" element={<Navigate to="/recruiter/dashboard" replace />} />
          </Route>

          {/* Trainer Portal Protected Routes */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboardPage />} />
            <Route path="trainings" element={<TrainerTrainingsPage />} />
            <Route path="participants" element={<TrainerParticipantsPage />} />
            <Route path="notifications" element={<TrainerNotificationsPage />} />
            <Route path="*" element={<Navigate to="/trainer/dashboard" replace />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
