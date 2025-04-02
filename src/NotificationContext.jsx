import { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success", duration = 5000) => {
    setNotification({ message, type });

    if (duration) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
