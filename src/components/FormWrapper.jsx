import React from "react";

export default function FormWrapper({
  children,
  title,
  className = "",
  description,
}) {
  return (
    <div className={`form-wrapper ${className}`}>
      {title && <h2 className="form-wrapper-title">{title}</h2>}
      {description && <p className="form-wrapper-description">{description}</p>}
      {children}
    </div>
  );
}
