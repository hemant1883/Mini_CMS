import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Signup from './pages/Signup.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import ExamSeating from './pages/student/ExamSeating.jsx';
import FacultyDashboard from './pages/faculty/FacultyDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentManagement from './pages/admin/StudentManagement.jsx';
import TimetableManagement from './pages/admin/TimetableManagement.jsx';
import FacultyDirectory from "./pages/student/FacultyDirectory.jsx";
import Profile from "./pages/common/Profile.jsx";
import FacultyWeeklySchedule from "./pages/faculty/FacultyWeeklySchedule.jsx";
import ExamSeatingManagement from "./pages/admin/ExamSeatingManagement.jsx";
const Layout = ({ children }) => {
  return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
  );
};

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Routes */}
            <Route path="/student" element={<PrivateRoute role="STUDENT"><StudentDashboard /></PrivateRoute>} />
            <Route path="/student/seating" element={<PrivateRoute role="STUDENT"><ExamSeating /></PrivateRoute>} />
            <Route path="/student/faculty" element={<PrivateRoute role="STUDENT"><FacultyDirectory /></PrivateRoute>} />
            <Route path="/student/profile" element={<PrivateRoute role="STUDENT"><Profile /></PrivateRoute>} />

            {/* Faculty Routes */}
            <Route path="/faculty" element={<PrivateRoute role="FACULTY"><FacultyDashboard /></PrivateRoute>} />
            <Route path="/faculty/profile" element={<PrivateRoute role="FACULTY"><Profile /></PrivateRoute>} />
            <Route path="/faculty/schedule" element={<PrivateRoute role="FACULTY"><FacultyWeeklySchedule /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/students" element={<PrivateRoute role="ADMIN"><StudentManagement /></PrivateRoute>} />
            <Route path="/admin/timetable" element={<PrivateRoute role="ADMIN"><TimetableManagement /></PrivateRoute>} />
            <Route path="/admin/seating" element={<PrivateRoute role="ADMIN"><ExamSeatingManagement /></PrivateRoute>} />
            <Route path="/admin/profile" element={<PrivateRoute role="ADMIN"><Profile /></PrivateRoute>} />

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
