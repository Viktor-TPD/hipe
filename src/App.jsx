import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import NotificationDisplay from "./components/NotificationDisplay";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Register from "./components/Register";

import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "./UnauthorizedPage";

import StudentProfile from "./components/StudentProfile";
import CompanyProfile from "./components/CompanyProfile";

import BrowseStudents from "./components/BrowseStudents";
import BrowseCompanies from "./components/BrowseCompanies";

import "./App.css";
import "./styles/footer.css";

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <Header />
      <main className="app-content">
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

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
            path="/profile"
            element={
              <ProtectedRoute>
                {currentUser?.userType === "student" ? (
                  <StudentProfile />
                ) : (
                  <CompanyProfile />
                )}
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                {currentUser?.userType === "student" ? (
                  <BrowseCompanies />
                ) : (
                  <BrowseStudents />
                )}
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute requiredUserType="company">
                <h1>Favourite students displayed here</h1>
                {/* Post internship component would go here */}
              </ProtectedRoute>
            }
          />

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
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
        <NotificationDisplay />
      </NotificationProvider>
    </AuthProvider>
  );
}
