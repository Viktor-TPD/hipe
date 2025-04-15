import React from "react";

export default function AuthToggle({ activeMode, onToggle }) {
  const handleModeChange = (e) => {
    onToggle(e.target.value);
  };

  return (
    <div className="auth-toggle-container">
      <div className="options-container">
        <input
          type="radio"
          id="login-option"
          name="auth-mode"
          value="login"
          checked={activeMode === "login"}
          onChange={handleModeChange}
          className="radio-input"
        />
        <label htmlFor="login-option" className="option-label login">
          Logga in
        </label>

        <input
          type="radio"
          id="register-option"
          name="auth-mode"
          value="register"
          checked={activeMode === "register"}
          onChange={handleModeChange}
          className="radio-input"
        />
        <label htmlFor="register-option" className="option-label register">
          Registrera
        </label>
      </div>
    </div>
  );
}
