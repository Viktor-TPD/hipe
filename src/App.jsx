import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import InputBoxTest from "./components/InputBoxTest";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "./UnauthorizedPage";
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

        {/* Login route */}
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
          path="/student-profile"
          element={
            <ProtectedRoute requiredUserType="student">
              <h1>Student Profile</h1>
              {/* Student profile component would go here */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/browse-companies"
          element={
            <ProtectedRoute requiredUserType="student">
              <h1>Browse Companies</h1>
              {/* Browse companies component would go here */}
            </ProtectedRoute>
          }
        />

        {/* Company-specific routes */}
        <Route
          path="/company-profile"
          element={
            <ProtectedRoute requiredUserType="company">
              <h1>Company Profile</h1>
              {/* Company profile component would go here */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-internship"
          element={
            <ProtectedRoute requiredUserType="company">
              <h1>Post Internship</h1>
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
