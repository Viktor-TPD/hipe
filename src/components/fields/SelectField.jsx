import React from "react";
import Select from "react-select";
import { useFormContext } from "../Form";

export default function SelectField({
  name,
  label,
  options,
  value,
  error = null,
  touched = false,
  required = false,
  placeholder = "Select...",
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

  const handleSelectChange = (selectedOption) => {
    const changeEvent = {
      target: {
        name: name,
        value: selectedOption,
        type: "select",
      },
    };
    handleChange(changeEvent);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "36px",
      borderRadius: "4px",
      border: hasError ? "1px solid #e53e3e" : "1px solid #ccc",
      boxShadow: hasError ? "0 0 0 1px #e53e3e" : provided.boxShadow,
      "&:hover": {
        border: hasError ? "1px solid #e53e3e" : "1px solid #a0aec0",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      width: "21.9rem",
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

  let currentValue = null;

  if (
    fieldValue &&
    typeof fieldValue === "object" &&
    "value" in fieldValue &&
    "label" in fieldValue
  ) {
    currentValue = fieldValue;
  } else if (fieldValue && typeof fieldValue === "string") {
    currentValue =
      options.find((option) => option.value === fieldValue) || null;
  }

  const handleSelectBlur = () => {
    const blurEvent = {
      target: { name },
    };
    handleBlur(blurEvent);
  };

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
        onBlur={handleSelectBlur}
        placeholder={placeholder}
        className={hasError ? "select-error" : ""}
        styles={customStyles}
        isClearable={!required}
      />
      {hasError && <div className="error-text">{fieldError}</div>}
    </div>
  );
}
