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
  const handleSelectChange = (selectedOption) => {
    // Create a synthetic event object that matches what Form.jsx expects
    const changeEvent = {
      target: {
        name: name,
        value: selectedOption ? selectedOption.value : "", // Extract just the value string
        type: "select",
      },
    };
    onChange(changeEvent);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "30px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
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
      height: "30px",
    }),
  };
  // Find the current option object based on value
  const currentValue = options.find((option) => option.value === value) || null;

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
        onBlur={onBlur ? () => onBlur({ target: { name } }) : undefined}
        placeholder={placeholder}
        className={hasError ? "select-error" : ""}
      />
      {hasError && <div className="error-text">{error}</div>}
    </div>
  );
}
