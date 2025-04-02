import { useNotification } from "../NotificationContext";
import { useEffect } from "react";

export default function NotificationDisplay() {
  const { notification, clearNotification } = useNotification();

  // Auto-dismiss the notification after animation completes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        // This timeout should match the CSS transition duration
        document
          .getElementById("notification-container")
          .classList.add("fade-out");
      }, 4500); // Slightly less than the total duration to start fade out

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("fade-out")) {
      clearNotification();
    }
  };

  if (!notification) return null;

  return (
    <div
      id="notification-container"
      className={`notification-container ${notification.type}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="notification-content">
        {notification.type === "success" && (
          <span className="notification-icon">✓</span>
        )}
        {notification.type === "error" && (
          <span className="notification-icon">✗</span>
        )}
        <p>{notification.message}</p>
      </div>
      <button
        className="notification-close"
        onClick={clearNotification}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
