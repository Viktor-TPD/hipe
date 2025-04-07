import { useFormContext } from "../Form";

export default function CheckboxField({
  name,
  label,
  checked,
  error = null,
  touched = false,
  required = false,
}) {
  const {
    handleChange,
    handleBlur,
    formData,
    errors,
    touched: formTouched,
  } = useFormContext();

  // Use context values if not explicitly provided as props
  const fieldChecked =
    checked !== undefined ? checked : formData[name] || false;
  const fieldError = error || errors[name];
  const fieldTouched = touched || formTouched[name];
  const hasError = fieldTouched && fieldError;

  return (
    <div className="field-container checkbox-container">
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={fieldChecked}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          className={hasError ? "checkbox-error" : ""}
        />
        <label htmlFor={name} className="checkbox-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      </div>
      {hasError && <div className="error-text">{fieldError}</div>}
    </div>
  );
}
