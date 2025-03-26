import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));

      // Optional: Verify token with your backend
      //   verifyUserSession(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const verifyUserSession = async (user) => {
    if (!user || !user.userId) return;

    try {
      // Call your backend to verify the user session
      const response = await fetch(`http://localhost:4000/api/verify-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      if (!response.ok) {
        // Session is invalid, log the user out
        logout();
      }
    } catch (error) {
      console.error("Error verifying session:", error);
    }
  };

  // Login function
  const login = (userData) => {
    // Ensure the data contains MongoDB userId
    if (!userData.userId) {
      console.error("Login failed: No user ID provided");
      return false;
    }

    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  };

  const logout = async () => {
    try {
      if (currentUser?.userId) {
        await fetch(`http://localhost:4000/api/logout`, {
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

  const value = {
    currentUser,
    login,
    logout,
    loading,
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
