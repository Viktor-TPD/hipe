export default function CheckboxField({ name, label, checked, onChange }) {
  return (
    <div className="form-field checkbox-field">
      <label htmlFor={name}>{label}</label>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked || false}
        onChange={onChange}
      />
    </div>
  );
}
