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
  const buttonStyle =
    variant === "primary" ? { color: "var(--bg-white)", ...style } : style;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant} ${className} focus-visible-only`}
      style={buttonStyle}
    >
      {children}
    </button>
  );
};

export default Button;
