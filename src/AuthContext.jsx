import { createContext, useState, useContext, useEffect } from "react";
import { API_BASE_URL } from "./config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = localStorage.getItem("user");

        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);

        if (user && user.userId) {
          const isValid = await verifyUserSession(user);

          if (isValid) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error loading user session:", error);
        setAuthError("Failed to restore session");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const verifyUserSession = async (user) => {
    if (!user || !user.userId) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error verifying session:", error);
      return false;
    }
  };

  const login = (userData) => {
    try {
      setAuthError(null);

      if (!userData.userId || !userData.email || !userData.userType) {
        setAuthError("Invalid user data");
        return false;
      }

      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Login failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);

      if (currentUser?.userId) {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser.userId }),
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("user");
    }
  };

  const updateUserData = (newData) => {
    if (!currentUser) return false;

    try {
      const updatedUser = {
        ...currentUser,
        ...newData,
        userId: currentUser.userId,
        userType: currentUser.userType,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUserData,
    loading,
    authError,
    clearAuthError: () => setAuthError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
