import React from 'react';
import './../../styles/radioField.css';
import './../../styles/styles.css';

export default function RadioField({
  name,
  label,
  options = [],
  value = 'dd',
  // defaultValue = 'dd',
  onChange,
  checked = true,
  onBlur,
  required = false,
  error = null,
  touched = false,

}) {
  const hasError = touched && error;
console.table(value)
  return (
    <div className="field-container">
      
      <div className="options-container">
        {options.map((option) => (
          <div key={option.value} className="option-item">
            <input
              className="radio-input"
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value || defaultValue}
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