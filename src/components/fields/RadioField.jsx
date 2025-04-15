import React from "react";
import { useFormContext } from "../Form";
import "./../../styles/radioField.css";

export default function RadioField({
  name,
  label,
  options = [],
  value,
  error = null,
  touched = false,
  required = false,
  onValueChange,
}) {
  const {
    handleChange,
    handleBlur,
    formData,
    errors,
    touched: formTouched,
  } = useFormContext();

  const fieldValue = value || formData[name] || "";
  const fieldError = error || errors[name];
  const fieldTouched = touched || formTouched[name];
  const hasError = fieldTouched && fieldError;

  const handleRadioChange = (e) => {
    handleChange(e);
    if (onValueChange) {
      onValueChange(e);
    }
  };

  return (
    <div className="field-container">
      <label className="field-label">
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>

      <div className="options-container">
        {options.map((option) => (
          <div key={option.value} className="option-item">
            <input
              className="radio-input"
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={fieldValue === option.value}
              onChange={handleRadioChange}
              onBlur={handleBlur}
              required={required && !fieldValue}
              tabIndex={0}
            />
            <label
              className={`option-label ${option.value}`}
              htmlFor={`${name}-${option.value}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {hasError && <div className="error-text">{fieldError}</div>}
    </div>
  );
}
