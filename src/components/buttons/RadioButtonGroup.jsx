import React from 'react';
import './../../styles/radioButtonGroup.css';
import './../../styles/styles.css';

const RadioButtonGroup = ({ 
  options, 
  selectedValue, 
  onChange, 
  name, 
  className = '' 
}) => {
  return (
    <div className={`radio-group ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="radio-option">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
          />
          <label 
            htmlFor={`${name}-${option.value}`}
            className="radio-label"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;