export default function TextField({
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  autoComplete = "off",
}) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}
