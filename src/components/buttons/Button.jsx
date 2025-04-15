import React from "react";
import "./../../styles/button.css";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary", // primary, filter, linkNavbar, select
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant} ${className} focus-visible-only`}
    >
      {children}
    </button>
  );
};

export default Button;
