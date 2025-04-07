import React from "react";
import { useFormContext } from "../Form";
import "./../../styles/radioField.css";
import "./../../styles/styles.css";

export default function RadioField({
  name,
  label,
  options = [],
  value,
  error = null,
  touched = false,
  required = false,
  onValueChange, // Added callback for external state updates
}) {
  const {
    handleChange,
    handleBlur,
    formData,
    errors,
    touched: formTouched,
  } = useFormContext();

  // Use context values if not explicitly provided as props
  const fieldValue = value || formData[name] || "";
  const fieldError = error || errors[name];
  const fieldTouched = touched || formTouched[name];
  const hasError = fieldTouched && fieldError;

  // Custom change handler that calls both context handler and external callback
  const handleRadioChange = (e) => {
    handleChange(e); // Update form state
    if (onValueChange) {
      onValueChange(e); // Call the external callback
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
