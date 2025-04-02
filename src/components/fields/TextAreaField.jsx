export default function TextareaField({
  name,
  label,
  value,
  onChange,
  onBlur,
  required = false,
  placeholder = "",
  rows = 4,
  maxLength,
  error = null,
  touched = false,
  resizable = true,
}) {
  const hasError = touched && error;

  return (
    <div className="field-container">
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="required-mark"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`textarea-field ${hasError ? "textarea-error" : ""}`}
        style={{ resize: resizable ? "vertical" : "none" }}
      />
      {maxLength && (
        <div className="character-count">
          {value ? value.length : 0}/{maxLength}
        </div>
      )}
      {hasError && <div className="error-text">{error}</div>}
    </div>
  );
}
