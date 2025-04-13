import { useFormContext } from "../Form";

export default function TextareaField({
  name,
  label,
  value,
  error = null,
  touched = false,
  required = false,
  placeholder = "",
  rows = 4,
  maxLength,
  resizable = true,
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
    <div className="field-container">
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={fieldValue}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`textarea-field ${hasError ? "textarea-error" : ""}`}
        style={{ resize: resizable ? "vertical" : "none" }}
      />
      {maxLength && (
        <div className="character-count">
          {fieldValue ? fieldValue.length : 0}/{maxLength}
        </div>
      )}
      {hasError && <div className="error-text">{fieldError}</div>}
    </div>
  );
}
