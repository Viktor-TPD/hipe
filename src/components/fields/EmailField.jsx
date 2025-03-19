export default function EmailField({ value, onChange, required = true }) {
  return (
    <div className="form-field">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
