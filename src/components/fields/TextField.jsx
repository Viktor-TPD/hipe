import { useFormContext } from "../Form";

export default function TextField({
  name,
  label,
  type = "text",
  value = "",
  error = null,
  touched = false,
  required = false,
  placeholder = "",
  autoComplete = "off",
  disabled = false,
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

  return (
    <div className="form-field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={hasError ? "input-error" : ""}
        disabled={disabled}
      />
      {hasError && <div className="error-text">{fieldError}</div>}
    </div>
  );
}
