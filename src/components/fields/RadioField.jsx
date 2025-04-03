import React from 'react';
import './../../styles/radioField.css';
import './../../styles/styles.css';

export default function RadioField({
  name,
  label,
  options = [],
  value = 'dd',
  onChange,
  checked = true,
  onBlur,
  required = false,
  error = null,
  touched = false,

}) {
  const hasError = touched && error;

  return (
    <div className="field-container">
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}
      <div className="options-container">
        {options.map((option) => (
          <div key={option.value} className="option-item">
            <input
              className="radio-input"
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              onBlur={onBlur}
              required={required && !value}
            />
            <label 
              className={`option-label  ${option.value}`} 
              htmlFor={`${name}-${option.value}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {hasError && <div className="error-text">{error}</div>}
    </div>
  );
}