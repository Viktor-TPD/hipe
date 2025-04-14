import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { AuthFormProvider } from "./AuthFormContext"; // Import our new context
import NotificationDisplay from "./components/NotificationDisplay";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./components/Home";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "./UnauthorizedPage";

import StudentProfile from "./components/StudentProfile";
import CompanyProfile from "./components/CompanyProfile";

import BrowseStudents from "./components/BrowseStudents";
import BrowseCompanies from "./components/BrowseCompanies";

import FavouriteStudents from "./components/FavouriteStudents";

import CompanyCard from "./components/CompanyCard";
import Policy from "./components/Policy";

import "./App.css";
import "./styles/footer.css";
import "./styles/header.css";

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <Header />
      <main className="app-content">
        <Routes>
          {/* Home route - accessible to everyone */}
          <Route path="/" element={<Home />} />

          {/* Profile routes */}
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

          {/* Browse routes */}
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

          {/* Favorites route */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute requiredUserType="company">
<FavouriteStudents/>
              </ProtectedRoute>
            }
          />
          {/* Policy route */}
          <Route path="/policy" element={<Policy />} />

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
        <AuthFormProvider>
          <AppContent />
          <NotificationDisplay />
        </AuthFormProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
