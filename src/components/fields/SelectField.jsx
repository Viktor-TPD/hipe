import React from "react";
import Select from "react-select";

export default function SelectField({
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  required = false,
  error = null,
  touched = false,
  placeholder = "Select...",
}) {
  // Log incoming value to debug
  console.log(`SelectField ${name} received value:`, value);

  const handleSelectChange = (selectedOption) => {
    console.log(`${name} changed to:`, selectedOption);

    // Create a synthetic event object that matches what Form.jsx expects
    const changeEvent = {
      target: {
        name: name,
        value: selectedOption, // Pass the entire object now, not just the value
        type: "select",
      },
    };
    onChange(changeEvent);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "36px",
      borderRadius: "4px",
      border: error ? "1px solid #e53e3e" : "1px solid #ccc",
      boxShadow: error ? "0 0 0 1px #e53e3e" : provided.boxShadow,
      "&:hover": {
        border: error ? "1px solid #e53e3e" : "1px solid #a0aec0",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "36px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#718096",
    }),
  };

  // Handle different value formats
  // If value is already a Select-compatible object with value and label properties
  let currentValue = null;

  if (
    value &&
    typeof value === "object" &&
    "value" in value &&
    "label" in value
  ) {
    currentValue = value;
  }
  // If value is a string, try to find the matching option
  else if (value && typeof value === "string") {
    currentValue = options.find((option) => option.value === value) || null;
  }

  const handleBlur = () => {
    if (onBlur) {
      onBlur({ target: { name } });
    }
  };

  const hasError = touched && error;

  return (
    <div className="field-container">
      <label className="field-label">
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <Select
        name={name}
        options={options}
        value={currentValue}
        onChange={handleSelectChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={hasError ? "select-error" : ""}
        styles={customStyles}
        isClearable={!required}
      />
      {hasError && <div className="error-text">{error}</div>}
    </div>
  );
}
