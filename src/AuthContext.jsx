import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if user is already logged in (from localStorage)
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
          // Verify the session is still valid with the backend
          const isValid = await verifyUserSession(user);

          if (isValid) {
            setCurrentUser(user);
          } else {
            // Session is invalid - clear localStorage
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
      // Call your backend to verify the user session
      const response = await fetch(`http://localhost:4000/api/v1/auth/verify`, {
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

  // Login function
  const login = (userData) => {
    try {
      setAuthError(null);

      // Ensure the data contains required fields
      if (!userData.userId || !userData.email || !userData.userType) {
        setAuthError("Invalid user data");
        return false;
      }

      // Store user in state and localStorage
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
        await fetch(`http://localhost:4000/api/v1/auth/logout`, {
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

  // Function to update user data (e.g., after profile changes)
  const updateUserData = (newData) => {
    if (!currentUser) return false;

    try {
      // Update only allowed fields
      const updatedUser = {
        ...currentUser,
        ...newData,
        // Ensure userId and userType cannot be changed
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
