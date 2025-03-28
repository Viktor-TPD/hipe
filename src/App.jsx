import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import InputBoxTest from "./components/InputBoxTest";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "./UnauthorizedPage";
import StudentProfile from "./components/StudentProfile";

import "./App.css";

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <Routes>
        {/* Home route - redirect to dashboard if logged in, otherwise login */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route, eller homeroute */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Register route */}
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected Dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Student-specific routes */}
        <Route
          path="create-studentProfile/"
          element={
            <ProtectedRoute requiredUserType="student">

              <StudentProfile />
             
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-companies"
          element={
            <ProtectedRoute requiredUserType="student">
              <h1>Browse Companies page</h1>
              <a href="">browse companies</a>
              {/* Browse companies component would go here */}
            </ProtectedRoute>
          }
        />

        {/* Company-specific routes */}
        <Route
          path="/api/create-companyProfile"
          element={
            <ProtectedRoute requiredUserType="company">
              <h1>Company Profile</h1>
              {/* Company profile component would go here */}
            </ProtectedRoute>
          }
        />

        <Route
          path="browse-students"
          element={
            <ProtectedRoute requiredUserType="company">
              <h1>Browse emong students here</h1>
              {/* Post internship component would go here */}
            </ProtectedRoute>
          }
          />

        <Route
          path="favourite-students"
          element={
            <ProtectedRoute requiredUserType="company">
              <h1>Favourite students displayed here</h1>
              {/* Post internship component would go here */}
            </ProtectedRoute>
          }
        />

        {/* @todo TEST, REMOVE THIS LATER */}
        <Route path="/input-test" element={<InputBoxTest />} />

        {/* Unauthorized access page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch-all for 404 */}
        <Route
          path="*"
          element={
            <div className="not-found">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for doesn't exist.</p>
              <button onClick={() => window.history.back()}>Go Back</button>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
