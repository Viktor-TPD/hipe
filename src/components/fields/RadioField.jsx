export default function RadioField({
  name,
  label,
  options = [],
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="form-field radio-field">
      <label>{label}</label>
      <div className="radio-options">
        {options.map((option) => (
          <div key={option.value} className="radio-option">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required && !value}
            />
            <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
